#!/usr/bin/env node

/**
 * AI Compliance Extractors
 * Main entry point - re-exports all extractor modules
 */

// Note: The actual extractor modules (git-evidence, package-evidence, ci-evidence)
// should be copied to src/extractors/ from D:\LLMComplianceSkill\tools\extractors\
// See SETUP.md for instructions.

module.exports = {
  // Users should import these individually:
  // const { gitEvidence } = require('ai-compliance-extractors');
  // Or use the CLI:
  // $ ai-compliance-extract --repo /path/to/repo --output results.json
};
