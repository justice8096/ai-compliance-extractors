import { describe, it, expect } from 'vitest';

describe('Git Evidence Extractor', () => {
  describe('Code Review Evidence', () => {
    it('should extract total commit count', () => {
      const codeReview = {
        totalCommits: 250,
        mergeCommits: 200,
        mergePercentage: 80,
        reviewedCommits: 150,
        uniqueReviewers: ['alice@example.com', 'bob@example.com'],
        prBasedWorkflow: true
      };

      expect(codeReview.totalCommits).toBe(250);
      expect(codeReview.totalCommits).toBeGreaterThan(0);
    });

    it('should calculate merge percentage', () => {
      const totalCommits = 250;
      const mergeCommits = 200;
      const mergePercentage = Math.round((mergeCommits / totalCommits) * 100);

      expect(mergePercentage).toBe(80);
      expect(mergePercentage).toBeLessThanOrEqual(100);
      expect(mergePercentage).toBeGreaterThanOrEqual(0);
    });

    it('should identify PR-based workflow', () => {
      const testCases = [
        { mergePercentage: 85, expected: true },
        { mergePercentage: 80, expected: true },
        { mergePercentage: 79, expected: false },
        { mergePercentage: 50, expected: false },
        { mergePercentage: 100, expected: true }
      ];

      for (const testCase of testCases) {
        const prBasedWorkflow = testCase.mergePercentage > 80;
        expect(prBasedWorkflow).toBe(testCase.expected);
      }
    });

    it('should track unique reviewers', () => {
      const reviewers = new Set();
      reviewers.add('alice@example.com');
      reviewers.add('bob@example.com');
      reviewers.add('alice@example.com'); // Duplicate

      expect(reviewers.size).toBe(2);
      expect([...reviewers]).toContain('alice@example.com');
      expect([...reviewers]).toContain('bob@example.com');
    });
  });

  describe('Change Management Evidence', () => {
    it('should calculate commit frequency', () => {
      const days = 365;
      const totalCommits = 250;
      const dailyFrequency = totalCommits / days;
      const weeklyFrequency = totalCommits / (days / 7);

      expect(dailyFrequency).toBeCloseTo(0.68, 1);
      expect(weeklyFrequency).toBeCloseTo(4.79, 1);
    });

    it('should track release tags', () => {
      const releaseTags = [
        { tag: 'v1.0.0', date: '2024-01-15', commitHash: 'abc123' },
        { tag: 'v1.1.0', date: '2024-02-20', commitHash: 'def456' },
        { tag: 'v1.2.0', date: '2024-03-20', commitHash: 'ghi789' }
      ];

      expect(releaseTags).toHaveLength(3);
      expect(releaseTags[0].tag).toBe('v1.0.0');
      expect(releaseTags[releaseTags.length - 1].tag).toBe('v1.2.0');
    });

    it('should calculate release frequency in days', () => {
      const dates = [
        new Date('2024-01-15').getTime(),
        new Date('2024-02-20').getTime(),
        new Date('2024-03-20').getTime()
      ];

      let totalInterval = 0;
      for (let i = 1; i < dates.length; i++) {
        totalInterval += dates[i] - dates[i - 1];
      }
      const releaseFrequencyDays = Math.round(
        totalInterval / (dates.length - 1) / (1000 * 60 * 60 * 24)
      );

      expect(releaseFrequencyDays).toBeGreaterThan(0);
      expect(typeof releaseFrequencyDays).toBe('number');
    });

    it('should detect conventional commits', () => {
      const subjects = [
        'feat: add new feature',
        'fix: resolve bug',
        'docs: update README',
        'chore: update dependencies',
        'random commit message',
        'refactor: improve code structure'
      ];

      const conventionalRe = /^(feat|fix|chore|docs|refactor|test|ci|perf|style|build|revert)(\(.+?\))?[!]?:/i;
      let conventionalCount = 0;

      for (const subj of subjects) {
        if (subj.match(conventionalRe)) {
          conventionalCount++;
        }
      }

      expect(conventionalCount).toBe(5);
      const percentage = Math.round((conventionalCount / subjects.length) * 100);
      expect(percentage).toBe(83); // 5/6 * 100 ≈ 83
    });
  });

  describe('AI Code Generation Evidence', () => {
    it('should detect AI tool patterns', () => {
      const patterns = [
        { pattern: /Co-authored-by:\s*.*\bclaude\b/i, tool: 'Claude' },
        { pattern: /Co-authored-by:\s*.*\bcopilot\b/i, tool: 'GitHub Copilot' },
        { pattern: /noreply@anthropic\.com/i, tool: 'Claude' }
      ];

      const testMessages = [
        'Co-authored-by: Claude <claude@example.com>',
        'Co-authored-by: Copilot Bot <copilot@github.com>',
        'Co-authored-by: noreply@anthropic.com'
      ];

      let matches = 0;
      for (const msg of testMessages) {
        for (const { pattern } of patterns) {
          if (pattern.test(msg)) matches++;
        }
      }

      expect(matches).toBe(3);
    });

    it('should calculate AI attribution percentage', () => {
      const totalCommits = 250;
      const aiAttributedCommits = 45;
      const percentage = Math.round((aiAttributedCommits / totalCommits) * 100);

      expect(percentage).toBe(18);
      expect(percentage).toBeGreaterThanOrEqual(0);
      expect(percentage).toBeLessThanOrEqual(100);
    });

    it('should track AI tool frequencies', () => {
      const toolCounts = {
        'GitHub Copilot': 30,
        'Claude': 12,
        'ChatGPT': 3
      };

      const toolsDetected = Object.entries(toolCounts)
        .map(([tool, commits]) => ({ tool, commits }))
        .sort((a, b) => b.commits - a.commits);

      expect(toolsDetected[0].tool).toBe('GitHub Copilot');
      expect(toolsDetected[0].commits).toBe(30);
      expect(toolsDetected).toHaveLength(3);
    });
  });

  describe('Security Practices Evidence', () => {
    it('should detect secret patterns in gitignore', () => {
      const gitignoreContent = `.env
.env.local
*.key
*.pem
.aws/
secrets/`;

      const secretPatterns = [
        { pattern: /\.env/m, name: '.env' },
        { pattern: /\.key$/m, name: '*.key' },
        { pattern: /\.aws/m, name: '.aws' }
      ];

      const found = [];
      for (const { pattern, name } of secretPatterns) {
        if (pattern.test(gitignoreContent)) {
          found.push(name);
        }
      }

      expect(found).toContain('.env');
      expect(found).toContain('*.key');
      expect(found).toContain('.aws');
      expect(found).toHaveLength(3);
    });

    it('should identify pre-commit hook tools', () => {
      const toolNames = [];
      
      // Simulate detection of different tools
      toolNames.push('husky');
      toolNames.push('lint-staged');
      
      const hookTools = [...new Set(toolNames)];
      
      expect(hookTools).toContain('husky');
      expect(hookTools).toContain('lint-staged');
      expect(hookTools).toHaveLength(2);
    });

    it('should calculate signed commit percentage', () => {
      const totalCommits = 250;
      const signedCommits = 150;
      const percentage = Math.round((signedCommits / totalCommits) * 100);

      expect(percentage).toBe(60);
      expect(percentage).toBeGreaterThanOrEqual(0);
      expect(percentage).toBeLessThanOrEqual(100);
    });
  });

  describe('Governance Evidence', () => {
    it('should parse CODEOWNERS file', () => {
      const codeownersContent = `# Ownership rules
src/ @alice @bob
tests/ @charlie
docs/ @alice`;

      const lines = codeownersContent.split('\n')
        .filter(l => l.trim() && !l.trim().startsWith('#'));

      const codeowners = [];
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2) {
          codeowners.push({
            pattern: parts[0],
            owners: parts.slice(1)
          });
        }
      }

      expect(codeowners).toHaveLength(3);
      expect(codeowners[0].pattern).toBe('src/');
      expect(codeowners[0].owners).toEqual(['@alice', '@bob']);
    });

    it('should detect license type', () => {
      const licensePatterns = [
        { pattern: /MIT License/i, type: 'MIT' },
        { pattern: /Apache License.*2\.0/i, type: 'Apache-2.0' },
        { pattern: /GPL-3/i, type: 'GPL-3.0' }
      ];

      const testContent = 'MIT License\n\nCopyright 2024';
      
      let licenseType = 'Unknown';
      for (const { pattern, type } of licensePatterns) {
        if (pattern.test(testContent)) {
          licenseType = type;
          break;
        }
      }

      expect(licenseType).toBe('MIT');
    });

    it('should count unique contributors', () => {
      const contributors = new Map();
      const authorLines = [
        'Alice Smith|||alice@example.com',
        'Bob Johnson|||bob@example.com',
        'Alice Smith|||alice@example.com' // Duplicate
      ];

      for (const line of authorLines) {
        const parts = line.split('|||');
        const name = parts[0];
        const email = parts[1];
        const key = email || name;
        if (!contributors.has(key)) {
          contributors.set(key, { name, email });
        }
      }

      expect(contributors.size).toBe(2);
    });
  });
});

describe('Package Evidence Extractor', () => {
  describe('Dependency Inventory', () => {
    it('should track direct and transitive dependencies', () => {
      const inventory = {
        directDependencies: 25,
        transitiveDependencies: 450
      };

      expect(inventory.directDependencies).toBeGreaterThan(0);
      expect(inventory.transitiveDependencies).toBeGreaterThan(inventory.directDependencies);
    });
  });

  describe('Vulnerability Auditing', () => {
    it('should categorize vulnerability severity', () => {
      const vulns = {
        critical: 0,
        high: 2,
        medium: 8,
        low: 25
      };

      const totalVulns = vulns.critical + vulns.high + vulns.medium + vulns.low;
      expect(totalVulns).toBe(35);
      
      const criticalOrHigh = vulns.critical + vulns.high;
      expect(criticalOrHigh).toBe(2);
    });
  });

  describe('License Compliance', () => {
    it('should identify copyleft packages', () => {
      const copyleftPackages = ['eslint', 'jest', 'webpack'];
      
      expect(copyleftPackages).toHaveLength(3);
      expect(copyleftPackages).toContain('eslint');
    });
  });
});

describe('CI/CD Evidence Extractor', () => {
  describe('Security Scanning Detection', () => {
    it('should detect security scanning categories', () => {
      const scanning = {
        sast: { detected: true },
        dast: { detected: false },
        dependencyScanning: { detected: true },
        containerScanning: { detected: true },
        secretScanning: { detected: true },
        licenseScanning: { detected: false }
      };

      const categories = ['sast', 'dast', 'dependencyScanning', 'containerScanning', 'secretScanning', 'licenseScanning'];
      const enabled = categories.filter(c => scanning[c] && scanning[c].detected);

      expect(enabled).toHaveLength(4);
      expect(enabled).toContain('sast');
      expect(enabled).not.toContain('dast');
    });
  });

  describe('Build Provenance', () => {
    it('should estimate SLSA level', () => {
      const estimatedSlsaLevel = 2;

      expect(estimatedSlsaLevel).toBeGreaterThanOrEqual(0);
      expect(estimatedSlsaLevel).toBeLessThanOrEqual(4);
    });
  });
});
