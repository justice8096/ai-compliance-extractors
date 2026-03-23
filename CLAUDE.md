# AI Compliance Evidence Extractors

## Purpose
Zero-dependency Node.js scripts that analyze any git repository for AI compliance evidence. Extracts data from git history, package ecosystems, and CI/CD pipelines to populate compliance documentation.

## Tools & Stack
- **Node.js** 18+ (zero npm dependencies)
- **git** CLI (accessed via execFileSync with argument arrays — no shell injection)

## Directory Structure
```
src/
  extract-evidence.js           — Orchestrator: runs all 3 extractors, merges results
  extractors/
    git-evidence.js             — Git history analysis (commits, PRs, AI attribution, security)
    package-evidence.js         — Package ecosystem analysis (npm/pip/cargo/go/composer/maven/gradle)
    ci-evidence.js              — CI/CD pipeline analysis (GitHub Actions/GitLab CI/Azure DevOps)
```

## Key Commands
```bash
# Run all extractors on a repo
node src/extract-evidence.js --repo /path/to/repo

# Run individual extractors
node src/extractors/git-evidence.js --repo /path/to/repo --days 365
node src/extractors/package-evidence.js --repo /path/to/repo
node src/extractors/ci-evidence.js --repo /path/to/repo

# Output to file
node src/extract-evidence.js --repo /path/to/repo --output evidence.json
```

## Technical Notes
- All extractors output JSON to stdout, progress/errors to stderr (designed for piping)
- Uses `execFileSync` with argument arrays — never string-interpolated shell commands
- Supports 7 package ecosystems: npm, pip, cargo, go, composer, maven, gradle
- Supports 4+ CI platforms: GitHub Actions, GitLab CI, Azure DevOps, Jenkins
- Works on any git repo in any programming language
