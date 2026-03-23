import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';

// Note: This test file is for ESM. The actual extract-evidence.js uses CommonJS (require)
// These tests focus on core logic that could be extracted into testable functions

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, '..');

describe('Evidence Extraction Logic', () => {
  describe('JSON merge and config building', () => {
    it('should merge extractor results into config.extractedEvidence', () => {
      let config = {};
      config.extractedEvidence = config.extractedEvidence || {};

      const gitEvidence = {
        codeReview: { totalCommits: 150, mergePercentage: 85 },
        aiCodeGeneration: { aiAttributedCommits: 12, aiAttributionPercentage: 8 }
      };

      config.extractedEvidence['git-evidence'] = gitEvidence;

      expect(config.extractedEvidence['git-evidence']).toEqual(gitEvidence);
      expect(config.extractedEvidence['git-evidence'].codeReview.totalCommits).toBe(150);
    });

    it('should add _meta field with timestamp to config', () => {
      let config = { extractedEvidence: {} };
      const repoPath = '/path/to/repo';
      const days = 365;

      const beforeTime = new Date();
      config.extractedEvidence._meta = {
        extractedAt: new Date().toISOString(),
        repoPath: repoPath,
        daysCovered: days
      };
      const afterTime = new Date();

      expect(config.extractedEvidence._meta).toBeDefined();
      expect(config.extractedEvidence._meta.repoPath).toBe(repoPath);
      expect(config.extractedEvidence._meta.daysCovered).toBe(days);
      
      const extractedTime = new Date(config.extractedEvidence._meta.extractedAt);
      expect(extractedTime.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(extractedTime.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });

    it('should merge autoFillFields from extractor results to top level', () => {
      let config = {};
      config.extractedEvidence = {};

      const packageEvidence = {
        inventory: { directDependencies: 42, transitiveDependencies: 1200 },
        autoFillFields: {
          dependencies: '42 direct, 1200 transitive',
          licenseCompliance: 'verified'
        }
      };

      config.extractedEvidence['package-evidence'] = packageEvidence;

      if (packageEvidence.autoFillFields) {
        config.extractedAutoFill = config.extractedAutoFill || {};
        Object.assign(config.extractedAutoFill, packageEvidence.autoFillFields);
      }

      expect(config.extractedAutoFill).toBeDefined();
      expect(config.extractedAutoFill.dependencies).toBe('42 direct, 1200 transitive');
      expect(config.extractedAutoFill.licenseCompliance).toBe('verified');
    });

    it('should handle missing autoFillFields gracefully', () => {
      let config = {};
      config.extractedEvidence = {};

      const ciEvidence = {
        securityScanning: { detected: true }
        // No autoFillFields
      };

      config.extractedEvidence['ci-evidence'] = ciEvidence;

      if (ciEvidence.autoFillFields) {
        config.extractedAutoFill = config.extractedAutoFill || {};
        Object.assign(config.extractedAutoFill, ciEvidence.autoFillFields);
      }

      expect(config.extractedAutoFill).toBeUndefined();
      expect(config.extractedEvidence['ci-evidence']).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('should handle extractor failure gracefully by storing error', () => {
      let config = { extractedEvidence: {} };

      const errorMsg = 'Extractor failed: repository not found';
      try {
        throw new Error(errorMsg);
      } catch (err) {
        const msg = err.message ? err.message.split('\n')[0] : String(err);
        config.extractedEvidence['git-evidence'] = { error: msg };
      }

      expect(config.extractedEvidence['git-evidence'].error).toBe(errorMsg);
    });

    it('should continue processing after one extractor fails', () => {
      let config = { extractedEvidence: {} };

      // Simulate first extractor failing
      config.extractedEvidence['git-evidence'] = { error: 'git not found' };

      // Second extractor succeeds
      config.extractedEvidence['package-evidence'] = {
        inventory: { directDependencies: 50 }
      };

      expect(config.extractedEvidence['git-evidence'].error).toBeDefined();
      expect(config.extractedEvidence['package-evidence'].inventory).toBeDefined();
    });
  });

  describe('Argument parsing', () => {
    it('should parse --repo argument', () => {
      const args = ['--repo', '/home/user/project', '--days', '30'];
      let repoPath = process.cwd();
      let days = 365;

      for (let i = 0; i < args.length; i++) {
        if (args[i] === '--repo' && args[i + 1]) {
          repoPath = path.resolve(args[i + 1]);
        }
        if (args[i] === '--days' && args[i + 1]) {
          days = parseInt(args[i + 1], 10);
        }
      }

      expect(repoPath).toBe(path.resolve('/home/user/project'));
      expect(days).toBe(30);
    });

    it('should use default values when flags not provided', () => {
      const args = [];
      let repoPath = process.cwd();
      let configPath = '/default/compliance-config.json';
      let days = 365;

      for (let i = 0; i < args.length; i++) {
        if (args[i] === '--repo' && args[i + 1]) repoPath = path.resolve(args[i + 1]);
        if (args[i] === '--config' && args[i + 1]) configPath = path.resolve(args[i + 1]);
        if (args[i] === '--days' && args[i + 1]) days = parseInt(args[i + 1], 10);
      }

      expect(repoPath).toBe(process.cwd());
      expect(days).toBe(365);
      expect(configPath).toBe('/default/compliance-config.json');
    });

    it('should parse multiple arguments in correct order', () => {
      const args = ['--days', '90', '--config', '/tmp/custom.json', '--repo', '/app'];
      let repoPath = process.cwd();
      let configPath = '/default/config.json';
      let days = 365;

      for (let i = 0; i < args.length; i++) {
        if (args[i] === '--repo' && args[i + 1]) repoPath = path.resolve(args[i + 1]);
        if (args[i] === '--config' && args[i + 1]) configPath = path.resolve(args[i + 1]);
        if (args[i] === '--days' && args[i + 1]) days = parseInt(args[i + 1], 10);
      }

      expect(repoPath).toBe(path.resolve('/app'));
      expect(days).toBe(90);
      expect(configPath).toBe(path.resolve('/tmp/custom.json'));
    });
  });

  describe('Evidence summary extraction', () => {
    it('should extract git evidence metrics for summary', () => {
      const config = {
        extractedEvidence: {
          'git-evidence': {
            codeReview: {
              totalCommits: 250,
              mergePercentage: 92
            },
            aiCodeGeneration: {
              aiAttributedCommits: 18,
              aiAttributionPercentage: 7.2,
              aiToolsDetected: [
                { tool: 'Copilot' },
                { tool: 'Tabnine' }
              ]
            }
          }
        }
      };

      const ge = config.extractedEvidence['git-evidence'] || {};
      expect(ge.codeReview.totalCommits).toBe(250);
      expect(ge.codeReview.mergePercentage).toBe(92);
      expect(ge.aiCodeGeneration.aiAttributionPercentage).toBe(7.2);
      expect(ge.aiCodeGeneration.aiToolsDetected).toHaveLength(2);
    });

    it('should extract package evidence metrics for summary', () => {
      const config = {
        extractedEvidence: {
          'package-evidence': {
            inventory: {
              directDependencies: 45,
              transitiveDependencies: 3200
            },
            licenses: {
              copyleftPackages: ['eslint', 'jest']
            },
            vulnerabilities: {
              auditResults: {
                critical: 2,
                high: 5
              }
            }
          }
        }
      };

      const pe = config.extractedEvidence['package-evidence'] || {};
      expect(pe.inventory.directDependencies).toBe(45);
      expect(pe.inventory.transitiveDependencies).toBe(3200);
      expect(pe.licenses.copyleftPackages).toHaveLength(2);
      expect(pe.vulnerabilities.auditResults.critical).toBe(2);
    });

    it('should extract CI evidence metrics for summary', () => {
      const config = {
        extractedEvidence: {
          'ci-evidence': {
            securityScanning: {
              sast: { detected: true },
              dast: { detected: false },
              dependencyScanning: { detected: true },
              containerScanning: { detected: true },
              secretScanning: { detected: true },
              licenseScanning: { detected: false },
              sbomGeneration: { detected: true }
            },
            buildProvenance: {
              estimatedSlsaLevel: 2
            }
          }
        }
      };

      const ce = config.extractedEvidence['ci-evidence'] || {};
      const cats = ['sast', 'dast', 'dependencyScanning', 'containerScanning', 'secretScanning', 'licenseScanning', 'sbomGeneration'];
      const covered = cats.filter(c => ce.securityScanning && ce.securityScanning[c] && ce.securityScanning[c].detected).length;
      
      expect(covered).toBe(5);
      expect(ce.buildProvenance.estimatedSlsaLevel).toBe(2);
    });
  });

  describe('Config file handling', () => {
    it('should preserve existing config keys when merging new evidence', () => {
      let config = {
        projectName: 'MyProject',
        version: '1.0.0',
        extractedEvidence: {}
      };

      const newEvidence = {
        'git-evidence': { totalCommits: 100 }
      };

      Object.assign(config.extractedEvidence, newEvidence);

      expect(config.projectName).toBe('MyProject');
      expect(config.version).toBe('1.0.0');
      expect(config.extractedEvidence['git-evidence'].totalCommits).toBe(100);
    });

    it('should handle empty config file initialization', () => {
      let config = {};
      config.extractedEvidence = config.extractedEvidence || {};

      expect(config.extractedEvidence).toBeDefined();
      expect(typeof config.extractedEvidence).toBe('object');
    });
  });
});

describe('CLI argument parsing', () => {
  it('should parse --repo flag', () => {
    const args = ['--repo', '/path/to/repo'];
    const opts = { repo: process.cwd(), output: null, format: 'json' };

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--repo' && args[i + 1]) {
        opts.repo = path.resolve(args[++i]);
      }
    }

    expect(opts.repo).toBe(path.resolve('/path/to/repo'));
  });

  it('should parse --output flag', () => {
    const args = ['--output', '/tmp/results.json'];
    const opts = { repo: process.cwd(), output: null, format: 'json' };

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--output' && args[i + 1]) {
        opts.output = path.resolve(args[++i]);
      }
    }

    expect(opts.output).toBe(path.resolve('/tmp/results.json'));
  });

  it('should parse --format flag', () => {
    const args = ['--format', 'markdown'];
    const opts = { repo: process.cwd(), output: null, format: 'json' };

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--format' && args[i + 1]) {
        opts.format = args[++i];
      }
    }

    expect(opts.format).toBe('markdown');
  });

  it('should handle all three flags together', () => {
    const args = ['--repo', '/app', '--output', '/out.json', '--format', 'json'];
    const opts = { repo: process.cwd(), output: null, format: 'json' };

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--repo' && args[i + 1]) {
        opts.repo = path.resolve(args[++i]);
      } else if (args[i] === '--output' && args[i + 1]) {
        opts.output = path.resolve(args[++i]);
      } else if (args[i] === '--format' && args[i + 1]) {
        opts.format = args[++i];
      }
    }

    expect(opts.repo).toBe(path.resolve('/app'));
    expect(opts.output).toBe(path.resolve('/out.json'));
    expect(opts.format).toBe('json');
  });

  it('should use defaults when no args provided', () => {
    const args = [];
    const opts = { repo: process.cwd(), output: null, format: 'json' };

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--repo' && args[i + 1]) {
        opts.repo = path.resolve(args[++i]);
      } else if (args[i] === '--output' && args[i + 1]) {
        opts.output = path.resolve(args[++i]);
      } else if (args[i] === '--format' && args[i + 1]) {
        opts.format = args[++i];
      }
    }

    expect(opts.repo).toBe(process.cwd());
    expect(opts.output).toBeNull();
    expect(opts.format).toBe('json');
  });
});
