# AI Compliance Extractors

Extract compliance evidence from git repositories, dependency manifests, and CI/CD pipelines. Zero external dependencies—uses only Node.js built-ins and system CLIs.

## Features

- **Git Evidence**: Commit history, code review metrics, AI tool attribution
- **Package Evidence**: Dependency inventory, SBOM, vulnerability audits, license compliance, AI tool detection
- **CI/CD Evidence**: Pipeline configurations, security scanning, build provenance, SLSA level assessment
- **Multiple Output Formats**: JSON, Markdown, and HTML

## Installation

```bash
npm install ai-compliance-extractors
```

Then set up the extractor modules:

```bash
cp D:\LLMComplianceSkill\tools\extractors\*.js src/extractors/
cp D:\LLMComplianceSkill\tools\extract-evidence.js src/
```

See [SETUP.md](SETUP.md) for detailed instructions.

## Usage

### CLI

```bash
# Basic usage (outputs JSON to stdout)
ai-compliance-extract --repo /path/to/repo

# Save to file (format inferred from extension or --format flag)
ai-compliance-extract --repo /path/to/repo --output evidence.json

# Output as Markdown
ai-compliance-extract --repo /path/to/repo --output evidence.md --format markdown

# Output as HTML
ai-compliance-extract --repo /path/to/repo --output report.html --format html

# Save JSON to file
ai-compliance-extract --repo /path/to/repo --output results.json --format json
```

### Output Formats

#### JSON (default)
Full structured data with all extracted evidence. Suitable for programmatic processing and data pipelines.

```bash
ai-compliance-extract --repo /path/to/repo --format json
```

#### Markdown
Human-readable report with organized sections and metrics. Great for documentation and sharing with teams.

```bash
ai-compliance-extract --repo /path/to/repo --format markdown --output evidence.md
```

#### HTML
Styled interactive report with visual metrics, color-coded status indicators, and responsive design. Best for presentations and compliance dashboards.

```bash
ai-compliance-extract --repo /path/to/repo --format html --output report.html
```

### Extractors

#### Git Evidence

Analyzes git commit history for:
- Total commits, merge percentage, code review metrics
- AI-attributed commits (detected via commit messages)
- AI tools used (GitHub Copilot, Claude, etc.)
- Time-based trends

```bash
node src/extractors/git-evidence.js --repo /path --days 365 --output results.json
```

#### Package Evidence

Scans dependency manifests (`package.json`, `requirements.txt`, `Cargo.toml`, etc.) for:
- Direct and transitive dependency counts
- SBOM (Software Bill of Materials)
- Vulnerability audit results
- License compliance (detects copyleft licenses)
- Dependency freshness
- AI tool detection (OpenAI, Anthropic, LangChain, etc.)

```bash
node src/extractors/package-evidence.js --repo /path --output results.json
```

#### CI/CD Evidence

Extracts CI/CD configuration (GitHub Actions, GitLab CI, Azure DevOps, etc.):
- Security scanning categories (SAST, DAST, dependency scanning, etc.)
- Build provenance and SLSA level assessment
- Test coverage metrics
- Secret scanning enablement
- Approval workflow configuration

```bash
node src/extractors/ci-evidence.js --repo /path --output results.json
```

## Output Format

### JSON Structure

```json
{
  "git-evidence": {
    "codeReview": {
      "totalCommits": 150,
      "mergePercentage": 75,
      "reviewedCommits": 100,
      "uniqueReviewers": ["alice@example.com"],
      "prBasedWorkflow": true
    },
    "aiCodeGeneration": {
      "aiAttributedCommits": 45,
      "aiAttributionPercentage": 30,
      "aiToolsDetected": [
        { "tool": "GitHub Copilot", "commits": 30 },
        { "tool": "Claude", "commits": 15 }
      ]
    },
    "changeManagement": {
      "commitFrequency": { "daily": 0.41, "weekly": 2.88, "monthly": 12.5 },
      "releaseTags": [
        { "tag": "v1.2.0", "date": "2024-03-20", "commitHash": "abc123" }
      ],
      "conventionalCommitPercentage": 85,
      "hasChangelog": true
    },
    "securityPractices": {
      "gitignoreExcludesSecrets": true,
      "hasPreCommitHooks": true,
      "hookTools": ["husky", "lint-staged"],
      "signedCommits": 120,
      "signedPercentage": 80
    },
    "governance": {
      "uniqueContributors": 8,
      "hasLicense": true,
      "licenseType": "MIT",
      "hasContributing": true,
      "codeowners": [
        { "pattern": "src/", "owners": ["@alice", "@bob"] }
      ]
    }
  },
  "package-evidence": {
    "inventory": {
      "directDependencies": 25,
      "transitiveDependencies": 150
    },
    "vulnerabilities": {
      "critical": 0,
      "high": 1,
      "medium": 5,
      "low": 12
    },
    "licenses": {
      "copyleftPackages": []
    },
    "aiTools": [
      { "package": "openai", "type": "api-client" },
      { "package": "langchain", "type": "framework" }
    ]
  },
  "ci-evidence": {
    "securityScanning": {
      "sast": { "detected": true },
      "dast": { "detected": false },
      "dependencyScanning": { "detected": true },
      "containerScanning": { "detected": true }
    },
    "buildProvenance": {
      "estimatedSlsaLevel": 2
    }
  }
}
```

### Markdown Output

The Markdown format generates a well-structured report suitable for version control and documentation:

```markdown
# Compliance Evidence Report

Generated: 2024-03-23T12:45:00Z

## Git Evidence

### Code Review
- Total Commits: 150
- Merge Commits: 112 (75%)
- Reviewed Commits: 100
- Unique Reviewers: 3
- PR-Based Workflow: Yes

### AI Code Generation
- AI-Attributed Commits: 45 (30%)
- AI Tools Detected:
  - GitHub Copilot: 30 commits
  - Claude: 15 commits
...
```

### HTML Output

The HTML format produces a styled, interactive report with:
- Visual metric cards with color-coded status
- Responsive design for all screen sizes
- Organized sections with collapsible details
- Professional styling suitable for stakeholder presentations

## Command Line Options

```
Usage: ai-compliance-extract --repo <path> [--output <path>] [--format json|markdown|html]

Options:
  --repo <path>      Target repository (default: current directory)
  --output <path>    Output file path (default: stdout)
  --format <fmt>     Output format: json, markdown, or html (default: json)
  --help, -h         Show this help message
```

## Examples

### Generate Markdown report and save
```bash
ai-compliance-extract --repo /path/to/repo --format markdown --output compliance-report.md
```

### Generate HTML dashboard
```bash
ai-compliance-extract --repo /path/to/repo --format html --output compliance-dashboard.html
```

### Output JSON to stdout for piping
```bash
ai-compliance-extract --repo /path/to/repo | jq '.git-evidence.codeReview'
```

### Compare two repositories
```bash
ai-compliance-extract --repo /repo/a --output report-a.json --format json
ai-compliance-extract --repo /repo/b --output report-b.json --format json
# Use jq or other tools to compare
```

## Security Notes

All extractors use only hardcoded CLI commands (`git`, `npm`, `pip`, etc.). No user input is interpolated into shell commands—the `--repo` path is always passed as a working directory or command argument, never in a shell string template.

The command injection vulnerability in `git-evidence.js` has been fixed: `execFileSync` with argument arrays is used instead of `execSync` with shell strings.

## Testing

```bash
npm test
```

Tests cover:
- CLI argument parsing for all flag combinations
- Output formatter functionality (JSON, Markdown, HTML)
- Evidence extraction logic
- Git command execution and data parsing
- Error handling and edge cases

## License

MIT
