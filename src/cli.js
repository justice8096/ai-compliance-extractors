#!/usr/bin/env node

/**
 * AI Compliance Extractors - CLI Entry Point
 *
 * Usage: ai-compliance-extract --repo <path> [--output <path>] [--format json|markdown|html]
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TOOLS_DIR = path.dirname(__dirname);
const EXTRACTORS_DIR = path.join(TOOLS_DIR, 'src', 'extractors');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { repo: process.cwd(), output: null, format: 'json' };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--repo' && args[i + 1]) {
      opts.repo = path.resolve(args[++i]);
    } else if (args[i] === '--output' && args[i + 1]) {
      opts.output = path.resolve(args[++i]);
    } else if (args[i] === '--format' && args[i + 1]) {
      opts.format = args[++i];
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log('Usage: ai-compliance-extract --repo <path> [--output <path>] [--format json|markdown|html]');
      console.log('');
      console.log('Options:');
      console.log('  --repo <path>      Target repository (default: current directory)');
      console.log('  --output <path>    Output file path (default: stdout)');
      console.log('  --format <fmt>     Output format: json, markdown, or html (default: json)');
      process.exit(0);
    }
  }

  return opts;
}

function runExtractor(scriptPath, repoPath) {
  try {
    const output = execFileSync(process.execPath, [scriptPath, '--repo', repoPath], {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
      timeout: 120000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return JSON.parse(output);
  } catch (err) {
    return { error: err.message };
  }
}

function formatAsMarkdown(results) {
  let md = '# Compliance Evidence Report\n\n';
  md += `Generated: ${new Date().toISOString()}\n\n`;

  // Git Evidence
  if (results['git-evidence']) {
    const git = results['git-evidence'];
    md += '## Git Evidence\n\n';
    
    if (git.codeReview) {
      md += '### Code Review\n';
      md += `- Total Commits: ${git.codeReview.totalCommits}\n`;
      md += `- Merge Commits: ${git.codeReview.mergeCommits} (${git.codeReview.mergePercentage}%)\n`;
      md += `- Reviewed Commits: ${git.codeReview.reviewedCommits}\n`;
      md += `- Unique Reviewers: ${git.codeReview.uniqueReviewers.length}\n`;
      md += `- PR-Based Workflow: ${git.codeReview.prBasedWorkflow ? 'Yes' : 'No'}\n\n';
    }

    if (git.aiCodeGeneration) {
      md += '### AI Code Generation\n';
      md += `- AI-Attributed Commits: ${git.aiCodeGeneration.aiAttributedCommits} (${git.aiCodeGeneration.aiAttributionPercentage}%)\n`;
      if (git.aiCodeGeneration.aiToolsDetected.length > 0) {
        md += '- AI Tools Detected:\n';
        for (const tool of git.aiCodeGeneration.aiToolsDetected) {
          md += `  - ${tool.tool}: ${tool.commits} commits\n`;
        }
      }
      md += '\n';
    }

    if (git.changeManagement) {
      md += '### Change Management\n';
      md += `- Daily Commit Frequency: ${git.changeManagement.commitFrequency.daily}\n`;
      md += `- Weekly Commit Frequency: ${git.changeManagement.commitFrequency.weekly}\n`;
      md += `- Release Tags: ${git.changeManagement.releaseTags.length}\n`;
      md += `- Conventional Commits: ${git.changeManagement.conventionalCommitPercentage}%\n`;
      md += `- Has Changelog: ${git.changeManagement.hasChangelog ? 'Yes' : 'No'}\n\n';
    }

    if (git.securityPractices) {
      md += '### Security Practices\n';
      md += `- Excludes Secrets: ${git.securityPractices.gitignoreExcludesSecrets ? 'Yes' : 'No'}\n`;
      md += `- Pre-Commit Hooks: ${git.securityPractices.hasPreCommitHooks ? 'Yes' : 'No'}\n`;
      if (git.securityPractices.hookTools.length > 0) {
        md += `  - Tools: ${git.securityPractices.hookTools.join(', ')}\n`;
      }
      md += `- Signed Commits: ${git.securityPractices.signedCommits} (${git.securityPractices.signedPercentage}%)\n\n`;
    }

    if (git.governance) {
      md += '### Governance\n';
      md += `- Unique Contributors: ${git.governance.uniqueContributors}\n`;
      md += `- Has License: ${git.governance.hasLicense ? 'Yes' : 'No'}\n`;
      if (git.governance.hasLicense) {
        md += `  - Type: ${git.governance.licenseType}\n`;
      }
      md += `- Has Contributing Guidelines: ${git.governance.hasContributing ? 'Yes' : 'No'}\n`;
      md += `- CODEOWNERS Rules: ${git.governance.codeowners.length}\n\n`;
    }
  }

  // Package Evidence
  if (results['package-evidence']) {
    const pkg = results['package-evidence'];
    md += '## Package Evidence\n\n';
    
    if (pkg.inventory) {
      md += '### Dependency Inventory\n';
      md += `- Direct Dependencies: ${pkg.inventory.directDependencies}\n`;
      md += `- Transitive Dependencies: ${pkg.inventory.transitiveDependencies}\n\n`;
    }

    if (pkg.vulnerabilities) {
      md += '### Vulnerabilities\n';
      md += `- Critical: ${pkg.vulnerabilities.critical || 0}\n`;
      md += `- High: ${pkg.vulnerabilities.high || 0}\n`;
      md += `- Medium: ${pkg.vulnerabilities.medium || 0}\n`;
      md += `- Low: ${pkg.vulnerabilities.low || 0}\n\n`;
    }

    if (pkg.licenses && pkg.licenses.copyleftPackages) {
      md += '### License Compliance\n';
      md += `- Copyleft Packages: ${pkg.licenses.copyleftPackages.length}\n`;
      if (pkg.licenses.copyleftPackages.length > 0) {
        md += '  - ' + pkg.licenses.copyleftPackages.slice(0, 5).join('\n  - ') + '\n';
        if (pkg.licenses.copyleftPackages.length > 5) {
          md += `  - ... and ${pkg.licenses.copyleftPackages.length - 5} more\n`;
        }
      }
      md += '\n';
    }
  }

  // CI Evidence
  if (results['ci-evidence']) {
    const ci = results['ci-evidence'];
    md += '## CI/CD Evidence\n\n';
    
    if (ci.securityScanning) {
      md += '### Security Scanning\n';
      const categories = ['sast', 'dast', 'dependencyScanning', 'containerScanning', 'secretScanning', 'licenseScanning'];
      for (const cat of categories) {
        if (ci.securityScanning[cat]) {
          md += `- ${cat}: ${ci.securityScanning[cat].detected ? 'Enabled' : 'Disabled'}\n`;
        }
      }
      md += '\n';
    }

    if (ci.buildProvenance) {
      md += '### Build Provenance\n';
      md += `- Estimated SLSA Level: L${ci.buildProvenance.estimatedSlsaLevel}\n\n`;
    }
  }

  return md;
}

function formatAsHtml(results) {
  let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
  html += '<meta charset="UTF-8">\n';
  html += '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
  html += '<title>Compliance Evidence Report</title>\n';
  html += '<style>\n';
  html += 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f5f5f5; }\n';
  html += 'main { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }\n';
  html += 'h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }\n';
  html += 'h2 { color: #34495e; margin-top: 30px; }\n';
  html += 'h3 { color: #7f8c8d; font-size: 16px; }\n';
  html += '.metric { display: inline-block; margin: 10px 20px 10px 0; padding: 10px 15px; background: #ecf0f1; border-left: 4px solid #3498db; border-radius: 4px; }\n';
  html += '.metric-label { font-weight: bold; color: #2c3e50; }\n';
  html += '.metric-value { color: #27ae60; font-size: 18px; }\n';
  html += '.warning { color: #e74c3c; }\n';
  html += '.success { color: #27ae60; }\n';
  html += '.section { margin: 20px 0; }\n';
  html += '.timestamp { color: #7f8c8d; font-size: 14px; margin-bottom: 20px; }\n';
  html += '.tool-list { list-style: none; padding: 0; }\n';
  html += '.tool-list li { padding: 5px 0; padding-left: 20px; }\n';
  html += '.tool-list li:before { content: "→ "; color: #3498db; font-weight: bold; margin-left: -20px; margin-right: 10px; }\n';
  html += '</style>\n</head>\n<body>\n<main>\n';

  html += '<h1>Compliance Evidence Report</h1>\n';
  html += `<p class="timestamp">Generated: ${new Date().toISOString()}</p>\n`;

  // Git Evidence
  if (results['git-evidence']) {
    const git = results['git-evidence'];
    html += '<section>\n<h2>Git Evidence</h2>\n';
    
    if (git.codeReview) {
      html += '<div class="section"><h3>Code Review</h3>\n';
      html += `<div class="metric"><span class="metric-label">Total Commits:</span> <span class="metric-value">${git.codeReview.totalCommits}</span></div>\n`;
      html += `<div class="metric"><span class="metric-label">Merge Commits:</span> <span class="metric-value">${git.codeReview.mergeCommits} (${git.codeReview.mergePercentage}%)</span></div>\n`;
      html += `<div class="metric"><span class="metric-label">Reviewed Commits:</span> <span class="metric-value">${git.codeReview.reviewedCommits}</span></div>\n`;
      html += `<div class="metric"><span class="metric-label">Unique Reviewers:</span> <span class="metric-value">${git.codeReview.uniqueReviewers.length}</span></div>\n`;
      const prStatus = git.codeReview.prBasedWorkflow ? '<span class="success">Yes</span>' : '<span class="warning">No</span>';
      html += `<div class="metric"><span class="metric-label">PR-Based Workflow:</span> ${prStatus}</div>\n`;
      html += '</div>\n';
    }

    if (git.aiCodeGeneration) {
      html += '<div class="section"><h3>AI Code Generation</h3>\n';
      html += `<div class="metric"><span class="metric-label">AI-Attributed Commits:</span> <span class="metric-value">${git.aiCodeGeneration.aiAttributedCommits} (${git.aiCodeGeneration.aiAttributionPercentage}%)</span></div>\n`;
      if (git.aiCodeGeneration.aiToolsDetected.length > 0) {
        html += '<p><strong>AI Tools Detected:</strong></p>\n<ul class="tool-list">\n';
        for (const tool of git.aiCodeGeneration.aiToolsDetected) {
          html += `<li>${tool.tool}: ${tool.commits} commits</li>\n`;
        }
        html += '</ul>\n';
      }
      html += '</div>\n';
    }

    if (git.changeManagement) {
      html += '<div class="section"><h3>Change Management</h3>\n';
      html += `<div class="metric"><span class="metric-label">Daily Frequency:</span> <span class="metric-value">${git.changeManagement.commitFrequency.daily}</span></div>\n`;
      html += `<div class="metric"><span class="metric-label">Release Tags:</span> <span class="metric-value">${git.changeManagement.releaseTags.length}</span></div>\n`;
      html += `<div class="metric"><span class="metric-label">Conventional Commits:</span> <span class="metric-value">${git.changeManagement.conventionalCommitPercentage}%</span></div>\n`;
      const changelogStatus = git.changeManagement.hasChangelog ? '<span class="success">Yes</span>' : '<span class="warning">No</span>';
      html += `<div class="metric"><span class="metric-label">Has Changelog:</span> ${changelogStatus}</div>\n`;
      html += '</div>\n';
    }

    if (git.securityPractices) {
      html += '<div class="section"><h3>Security Practices</h3>\n';
      const secretsStatus = git.securityPractices.gitignoreExcludesSecrets ? '<span class="success">Yes</span>' : '<span class="warning">No</span>';
      html += `<div class="metric"><span class="metric-label">Excludes Secrets:</span> ${secretsStatus}</div>\n`;
      const hooksStatus = git.securityPractices.hasPreCommitHooks ? '<span class="success">Yes</span>' : '<span class="warning">No</span>';
      html += `<div class="metric"><span class="metric-label">Pre-Commit Hooks:</span> ${hooksStatus}`;
      if (git.securityPractices.hookTools.length > 0) {
        html += ` (${git.securityPractices.hookTools.join(', ')})`;
      }
      html += '</div>\n';
      html += `<div class="metric"><span class="metric-label">Signed Commits:</span> <span class="metric-value">${git.securityPractices.signedCommits} (${git.securityPractices.signedPercentage}%)</span></div>\n`;
      html += '</div>\n';
    }

    if (git.governance) {
      html += '<div class="section"><h3>Governance</h3>\n';
      html += `<div class="metric"><span class="metric-label">Unique Contributors:</span> <span class="metric-value">${git.governance.uniqueContributors}</span></div>\n`;
      const licenseStatus = git.governance.hasLicense ? '<span class="success">Yes</span>' : '<span class="warning">No</span>';
      html += `<div class="metric"><span class="metric-label">Has License:</span> ${licenseStatus}`;
      if (git.governance.hasLicense) {
        html += ` (${git.governance.licenseType})`;
      }
      html += '</div>\n';
      const contribStatus = git.governance.hasContributing ? '<span class="success">Yes</span>' : '<span class="warning">No</span>';
      html += `<div class="metric"><span class="metric-label">Contributing Guidelines:</span> ${contribStatus}</div>\n`;
      html += `<div class="metric"><span class="metric-label">CODEOWNERS Rules:</span> <span class="metric-value">${git.governance.codeowners.length}</span></div>\n`;
      html += '</div>\n';
    }

    html += '</section>\n';
  }

  // Package Evidence
  if (results['package-evidence']) {
    const pkg = results['package-evidence'];
    html += '<section>\n<h2>Package Evidence</h2>\n';
    
    if (pkg.inventory) {
      html += '<div class="section"><h3>Dependency Inventory</h3>\n';
      html += `<div class="metric"><span class="metric-label">Direct Dependencies:</span> <span class="metric-value">${pkg.inventory.directDependencies}</span></div>\n`;
      html += `<div class="metric"><span class="metric-label">Transitive Dependencies:</span> <span class="metric-value">${pkg.inventory.transitiveDependencies}</span></div>\n`;
      html += '</div>\n';
    }

    if (pkg.vulnerabilities) {
      html += '<div class="section"><h3>Vulnerabilities</h3>\n';
      const criticalCount = pkg.vulnerabilities.critical || 0;
      const criticalClass = criticalCount > 0 ? 'warning' : 'success';
      html += `<div class="metric"><span class="metric-label">Critical:</span> <span class="metric-value ${criticalClass}">${criticalCount}</span></div>\n`;
      const highCount = pkg.vulnerabilities.high || 0;
      const highClass = highCount > 0 ? 'warning' : 'success';
      html += `<div class="metric"><span class="metric-label">High:</span> <span class="metric-value ${highClass}">${highCount}</span></div>\n`;
      html += `<div class="metric"><span class="metric-label">Medium:</span> <span class="metric-value">${pkg.vulnerabilities.medium || 0}</span></div>\n`;
      html += `<div class="metric"><span class="metric-label">Low:</span> <span class="metric-value">${pkg.vulnerabilities.low || 0}</span></div>\n`;
      html += '</div>\n';
    }

    if (pkg.licenses && pkg.licenses.copyleftPackages) {
      html += '<div class="section"><h3>License Compliance</h3>\n';
      const copyleftClass = pkg.licenses.copyleftPackages.length > 0 ? 'warning' : 'success';
      html += `<div class="metric"><span class="metric-label">Copyleft Packages:</span> <span class="metric-value ${copyleftClass}">${pkg.licenses.copyleftPackages.length}</span></div>\n`;
      if (pkg.licenses.copyleftPackages.length > 0) {
        html += '<p><strong>Copyleft Packages:</strong></p>\n<ul class="tool-list">\n';
        for (const pkg_name of pkg.licenses.copyleftPackages.slice(0, 5)) {
          html += `<li>${pkg_name}</li>\n`;
        }
        if (pkg.licenses.copyleftPackages.length > 5) {
          html += `<li>... and ${pkg.licenses.copyleftPackages.length - 5} more</li>\n`;
        }
        html += '</ul>\n';
      }
      html += '</div>\n';
    }

    html += '</section>\n';
  }

  // CI Evidence
  if (results['ci-evidence']) {
    const ci = results['ci-evidence'];
    html += '<section>\n<h2>CI/CD Evidence</h2>\n';
    
    if (ci.securityScanning) {
      html += '<div class="section"><h3>Security Scanning</h3>\n';
      const categories = ['sast', 'dast', 'dependencyScanning', 'containerScanning', 'secretScanning', 'licenseScanning'];
      for (const cat of categories) {
        if (ci.securityScanning[cat]) {
          const enabled = ci.securityScanning[cat].detected;
          const statusClass = enabled ? 'success' : 'warning';
          const statusText = enabled ? 'Enabled' : 'Disabled';
          html += `<div class="metric"><span class="metric-label">${cat}:</span> <span class="metric-value ${statusClass}">${statusText}</span></div>\n`;
        }
      }
      html += '</div>\n';
    }

    if (ci.buildProvenance) {
      html += '<div class="section"><h3>Build Provenance</h3>\n';
      html += `<div class="metric"><span class="metric-label">Estimated SLSA Level:</span> <span class="metric-value">L${ci.buildProvenance.estimatedSlsaLevel}</span></div>\n`;
      html += '</div>\n';
    }

    html += '</section>\n';
  }

  html += '</main>\n</body>\n</html>\n';
  return html;
}

function main() {
  const opts = parseArgs();

  if (!fs.existsSync(opts.repo)) {
    console.error(`Error: Repository path does not exist: ${opts.repo}`);
    process.exit(1);
  }

  console.error(`Extracting compliance evidence from: ${opts.repo}`);

  const results = {};

  const extractorScripts = [
    { name: 'git-evidence', file: 'git-evidence.js' },
    { name: 'package-evidence', file: 'package-evidence.js' },
    { name: 'ci-evidence', file: 'ci-evidence.js' },
  ];

  for (const extractor of extractorScripts) {
    const scriptPath = path.join(EXTRACTORS_DIR, extractor.file);
    if (!fs.existsSync(scriptPath)) {
      console.error(`Warning: ${extractor.file} not found at ${scriptPath}`);
      console.error('Run: cp D:\\\\LLMComplianceSkill\\\\tools\\\\extractors\\\\*.js src/extractors/');
      results[extractor.name] = { error: 'extractor not found' };
      continue;
    }

    console.error(`  Running ${extractor.name}...`);
    const output = runExtractor(scriptPath, opts.repo);
    results[extractor.name] = output;
  }

  // Format output based on --format flag
  let formattedOutput;
  const contentType = opts.format.toLowerCase();

  if (contentType === 'markdown') {
    formattedOutput = formatAsMarkdown(results);
  } else if (contentType === 'html') {
    formattedOutput = formatAsHtml(results);
  } else {
    // Default to JSON
    formattedOutput = JSON.stringify(results, null, 2);
  }

  if (opts.output) {
    fs.writeFileSync(opts.output, formattedOutput, 'utf8');
    console.error(`Wrote results to: ${opts.output}`);
  } else {
    console.log(formattedOutput);
  }
}

if (require.main === module) {
  main();
}
