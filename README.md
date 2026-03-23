# AI Compliance Extractors

Extract compliance evidence from git repositories, dependency manifests, and CI/CD pipelines. Zero external dependencies—uses only Node.js built-ins and system CLIs.

## Features

- **Git Evidence**: Commit history, code review metrics, AI tool attribution
- **Package Evidence**: Dependency inventory, SBOM, vulnerability audits, license compliance, AI tool detection
- **CI/CD Evidence**: Pipeline configurations, security scanning, build provenance, SLSA level assessment

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
# Basic usage
ai-compliance-extract --repo /path/to/repo

# Save to file
ai-compliance-extract --repo /path/to/repo --output evidence.json

# Custom format
ai-compliance-extract --repo /path/to/repo --format json
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

JSON with structure:

```json
{
  "git-evidence": {
    "codeReview": {
      "totalCommits": 150,
      "mergePercentage": 75
    },
    "aiCodeGeneration": {
      "aiAttributedCommits": 45,
      "aiAttributionPercentage": 30,
      "aiToolsDetected": [
        { "tool": "GitHub Copilot", "commits": 30 },
        { "tool": "Claude", "commits": 15 }
      ]
    }
  },
  "package-evidence": {
    "inventory": {
      "directDependencies": 25,
      "transitiveDependencies": 150
    },
    "vulnerabilities": {
      "auditResults": { "critical": 1, "high": 5, "medium": 12 }
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
      "dependencyScanning": { "detected": true }
    },
    "buildProvenance": {
      "estimatedSlsaLevel": 2
    }
  }
}
```

## Security Notes

All extractors use only hardcoded CLI commands (`git`, `npm`, `pip`, etc.). No user input is interpolated into shell commands—the `--repo` path is always passed as a working directory, never in a command string.

## License

MIT
