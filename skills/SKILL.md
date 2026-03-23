---
name: ai-compliance-extractors
description: Extract AI compliance evidence from git repos — commit history, dependencies, and CI/CD pipelines
version: 0.1.0
---

# AI Compliance Extractors Skill

Use this skill when the user needs to gather evidence of AI development practices from a software project for compliance, auditing, or documentation purposes.

## When to use
- User asks about AI compliance evidence in a codebase
- User needs to document their AI development practices
- User is preparing for an EU AI Act or similar compliance audit
- User wants to analyze a repo's development patterns

## How to use

Run all three extractors at once:
```bash
node extract-evidence.js <repo-path>
```

Or run individually:
```bash
# Git history analysis (commit patterns, PR workflows, AI attribution)
node src/extractors/git-evidence.js <repo-path>

# Package ecosystem analysis (dependency auditing across npm/pip/cargo/go/etc.)
node src/extractors/package-evidence.js <repo-path>

# CI/CD pipeline analysis (GitHub Actions, GitLab CI, Azure DevOps)
node src/extractors/ci-evidence.js <repo-path>
```

## Output
All extractors output JSON to stdout. The runner merges results into a single compliance config.

## Key behaviors
- Zero npm dependencies — uses only Node.js built-ins
- Works on any git repo in any language
- Uses execFileSync with argument arrays (no shell injection)
- Detects AI-related commit patterns, Dependabot/Renovate configs, security scanning steps
