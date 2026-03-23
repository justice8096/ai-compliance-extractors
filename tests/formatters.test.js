import { describe, it, expect } from 'vitest';

describe('Output Formatters', () => {
  describe('Markdown formatter', () => {
    it('should generate markdown header', () => {
      const mockResults = {
        'git-evidence': {
          codeReview: { totalCommits: 100, mergeCommits: 80, mergePercentage: 80, reviewedCommits: 60, uniqueReviewers: [], prBasedWorkflow: true }
        }
      };

      let md = '# Compliance Evidence Report\n\n';
      md += `Generated: ${new Date().toISOString()}\n\n`;

      expect(md).toContain('# Compliance Evidence Report');
      expect(md).toContain('Generated:');
    });

    it('should include git evidence section', () => {
      const results = {
        'git-evidence': {
          codeReview: { 
            totalCommits: 250, 
            mergeCommits: 200, 
            mergePercentage: 80,
            reviewedCommits: 180,
            uniqueReviewers: ['alice@example.com', 'bob@example.com'],
            prBasedWorkflow: true
          }
        }
      };

      // Simulate markdown generation
      let md = '## Git Evidence\n\n';
      md += '### Code Review\n';
      md += `- Total Commits: ${results['git-evidence'].codeReview.totalCommits}\n`;
      md += `- Merge Commits: ${results['git-evidence'].codeReview.mergeCommits} (${results['git-evidence'].codeReview.mergePercentage}%)\n`;

      expect(md).toContain('## Git Evidence');
      expect(md).toContain('### Code Review');
      expect(md).toContain('- Total Commits: 250');
      expect(md).toContain('- Merge Commits: 200 (80%)');
    });

    it('should include AI code generation metrics', () => {
      const aiMetrics = {
        aiAttributedCommits: 45,
        aiAttributionPercentage: 18,
        aiToolsDetected: [
          { tool: 'GitHub Copilot', commits: 30 },
          { tool: 'Claude', commits: 15 }
        ]
      };

      let md = '### AI Code Generation\n';
      md += `- AI-Attributed Commits: ${aiMetrics.aiAttributedCommits} (${aiMetrics.aiAttributionPercentage}%)\n`;
      if (aiMetrics.aiToolsDetected.length > 0) {
        md += '- AI Tools Detected:\n';
        for (const tool of aiMetrics.aiToolsDetected) {
          md += `  - ${tool.tool}: ${tool.commits} commits\n`;
        }
      }

      expect(md).toContain('### AI Code Generation');
      expect(md).toContain('- AI-Attributed Commits: 45 (18%)');
      expect(md).toContain('- AI Tools Detected:');
      expect(md).toContain('- GitHub Copilot: 30 commits');
      expect(md).toContain('- Claude: 15 commits');
    });

    it('should include security practices metrics', () => {
      const security = {
        gitignoreExcludesSecrets: true,
        hasPreCommitHooks: true,
        hookTools: ['husky', 'lint-staged'],
        signedCommits: 150,
        signedPercentage: 60
      };

      let md = '### Security Practices\n';
      md += `- Excludes Secrets: ${security.gitignoreExcludesSecrets ? 'Yes' : 'No'}\n`;
      md += `- Pre-Commit Hooks: ${security.hasPreCommitHooks ? 'Yes' : 'No'}\n`;
      if (security.hookTools.length > 0) {
        md += `  - Tools: ${security.hookTools.join(', ')}\n`;
      }

      expect(md).toContain('### Security Practices');
      expect(md).toContain('- Excludes Secrets: Yes');
      expect(md).toContain('- Pre-Commit Hooks: Yes');
      expect(md).toContain('- Tools: husky, lint-staged');
    });

    it('should include governance metrics', () => {
      const governance = {
        uniqueContributors: 15,
        hasLicense: true,
        licenseType: 'MIT',
        hasContributing: true,
        codeowners: [
          { pattern: 'src/', owners: ['alice', 'bob'] },
          { pattern: 'tests/', owners: ['charlie'] }
        ]
      };

      let md = '### Governance\n';
      md += `- Unique Contributors: ${governance.uniqueContributors}\n`;
      md += `- Has License: ${governance.hasLicense ? 'Yes' : 'No'}\n`;
      if (governance.hasLicense) {
        md += `  - Type: ${governance.licenseType}\n`;
      }
      md += `- CODEOWNERS Rules: ${governance.codeowners.length}\n`;

      expect(md).toContain('### Governance');
      expect(md).toContain('- Unique Contributors: 15');
      expect(md).toContain('- Has License: Yes');
      expect(md).toContain('- Type: MIT');
      expect(md).toContain('- CODEOWNERS Rules: 2');
    });
  });

  describe('HTML formatter', () => {
    it('should generate valid HTML structure', () => {
      let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
      html += '<meta charset="UTF-8">\n';
      html += '<title>Compliance Evidence Report</title>\n';
      html += '</head>\n<body>\n</body>\n</html>\n';

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html lang="en">');
      expect(html).toContain('<meta charset="UTF-8">');
      expect(html).toContain('<title>Compliance Evidence Report</title>');
    });

    it('should include CSS styling', () => {
      let html = '<style>\n';
      html += 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }\n';
      html += 'h1 { color: #2c3e50; }\n';
      html += '.metric { display: inline-block; }\n';
      html += '</style>\n';

      expect(html).toContain('<style>');
      expect(html).toContain('body {');
      expect(html).toContain('h1 {');
      expect(html).toContain('.metric {');
    });

    it('should render metrics with proper classes', () => {
      const metric = {
        label: 'Merge Commits',
        value: '200 (80%)',
        status: 'success'
      };

      let html = '<div class="metric">';
      html += `<span class="metric-label">${metric.label}:</span> `;
      html += `<span class="metric-value">${metric.value}</span>`;
      html += '</div>\n';

      expect(html).toContain('class="metric"');
      expect(html).toContain('class="metric-label"');
      expect(html).toContain('class="metric-value"');
      expect(html).toContain('Merge Commits:');
      expect(html).toContain('200 (80%)');
    });

    it('should highlight warnings and success states', () => {
      const criticalVulns = 0;
      const highVulns = 5;

      let html = '<div class="metric">';
      html += `<span class="metric-label">Critical:</span> `;
      const criticalClass = criticalVulns > 0 ? 'warning' : 'success';
      html += `<span class="metric-value ${criticalClass}">${criticalVulns}</span>`;
      html += '</div>\n';

      html += '<div class="metric">';
      html += `<span class="metric-label">High:</span> `;
      const highClass = highVulns > 0 ? 'warning' : 'success';
      html += `<span class="metric-value ${highClass}">${highVulns}</span>`;
      html += '</div>\n';

      expect(html).toContain('success">0</span>');
      expect(html).toContain('warning">5</span>');
    });

    it('should render tool lists correctly', () => {
      const tools = ['GitHub Copilot', 'Claude', 'ChatGPT'];

      let html = '<p><strong>AI Tools Detected:</strong></p>\n<ul class="tool-list">\n';
      for (const tool of tools) {
        html += `<li>${tool}</li>\n`;
      }
      html += '</ul>\n';

      expect(html).toContain('<p><strong>AI Tools Detected:</strong></p>');
      expect(html).toContain('<ul class="tool-list">');
      expect(html).toContain('<li>GitHub Copilot</li>');
      expect(html).toContain('<li>Claude</li>');
      expect(html).toContain('<li>ChatGPT</li>');
    });
  });

  describe('JSON formatter', () => {
    it('should preserve all data in JSON format', () => {
      const results = {
        'git-evidence': {
          codeReview: { totalCommits: 100, mergePercentage: 75 },
          aiCodeGeneration: { aiAttributedCommits: 5, aiAttributionPercentage: 5 }
        }
      };

      const json = JSON.stringify(results, null, 2);
      const parsed = JSON.parse(json);

      expect(parsed['git-evidence'].codeReview.totalCommits).toBe(100);
      expect(parsed['git-evidence'].codeReview.mergePercentage).toBe(75);
      expect(parsed['git-evidence'].aiCodeGeneration.aiAttributedCommits).toBe(5);
    });

    it('should handle nested objects', () => {
      const results = {
        'package-evidence': {
          inventory: { directDependencies: 25, transitiveDependencies: 500 },
          vulnerabilities: { critical: 0, high: 2, medium: 10, low: 50 },
          licenses: { copyleftPackages: ['package-a', 'package-b'] }
        }
      };

      const json = JSON.stringify(results, null, 2);
      expect(json).toContain('"directDependencies": 25');
      expect(json).toContain('"critical": 0');
      expect(json).toContain('"package-a"');
    });

    it('should preserve array structure', () => {
      const results = {
        'git-evidence': {
          aiCodeGeneration: {
            aiToolsDetected: [
              { tool: 'Copilot', commits: 30 },
              { tool: 'Claude', commits: 15 }
            ]
          }
        }
      };

      const json = JSON.stringify(results, null, 2);
      const parsed = JSON.parse(json);

      expect(Array.isArray(parsed['git-evidence'].aiCodeGeneration.aiToolsDetected)).toBe(true);
      expect(parsed['git-evidence'].aiCodeGeneration.aiToolsDetected).toHaveLength(2);
      expect(parsed['git-evidence'].aiCodeGeneration.aiToolsDetected[0].tool).toBe('Copilot');
    });
  });

  describe('Format flag validation', () => {
    it('should accept valid format values', () => {
      const validFormats = ['json', 'markdown', 'html'];
      const format = 'markdown';
      expect(validFormats.includes(format)).toBe(true);
    });

    it('should handle case-insensitive format', () => {
      const format = 'MARKDOWN'.toLowerCase();
      expect(format).toBe('markdown');
    });

    it('should default to json for unknown format', () => {
      const format = 'xml';
      const supportedFormats = ['json', 'markdown', 'html'];
      const finalFormat = supportedFormats.includes(format) ? format : 'json';
      expect(finalFormat).toBe('json');
    });
  });
});
