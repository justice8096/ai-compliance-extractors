#!/usr/bin/env node

/**
 * AI Compliance Extractors - CLI Entry Point
 *
 * Usage: ai-compliance-extract --repo <path> [--output <path>] [--format json|markdown]
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
      console.log('Usage: ai-compliance-extract --repo <path> [--output <path>] [--format json|markdown]');
      console.log('');
      console.log('Options:');
      console.log('  --repo <path>      Target repository (default: current directory)');
      console.log('  --output <path>    Output file path (default: stdout)');
      console.log('  --format <fmt>     Output format: json or markdown (default: json)');
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
      console.error('Run: cp D:\\LLMComplianceSkill\\tools\\extractors\\*.js src/extractors/');
      results[extractor.name] = { error: 'extractor not found' };
      continue;
    }

    console.error(`  Running ${extractor.name}...`);
    const output = runExtractor(scriptPath, opts.repo);
    results[extractor.name] = output;
  }

  // Output results
  const output = JSON.stringify(results, null, 2);

  if (opts.output) {
    fs.writeFileSync(opts.output, output, 'utf8');
    console.error(`Wrote results to: ${opts.output}`);
  } else {
    console.log(output);
  }
}

if (require.main === module) {
  main();
}
