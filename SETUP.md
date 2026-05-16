# Setup

`ai-compliance-extractors` is a zero-dependency Node.js package. The extractors and CLI ship inside the npm tarball — `npm install` is the entire setup.

## Install

```bash
npm install -g @justice8096/ai-compliance-extractors
```

Or as a project dependency:

```bash
npm install @justice8096/ai-compliance-extractors
```

## Verify

```bash
ai-compliance-extract --help
```

You should see:

```
Usage: ai-compliance-extract --repo <path> [--output <path>] [--format json|markdown]
```

## Run extraction

```bash
ai-compliance-extract --repo /path/to/repo --output evidence.json
```

The output file contains merged evidence from all three extractors (git, package, CI).

## Invoke individual extractors

Each extractor also runs standalone — useful when you only want one signal or want to compose them into your own pipeline:

```bash
node node_modules/@justice8096/ai-compliance-extractors/src/extractors/git-evidence.js --repo /path/to/repo --days 365
node node_modules/@justice8096/ai-compliance-extractors/src/extractors/package-evidence.js --repo /path/to/repo
node node_modules/@justice8096/ai-compliance-extractors/src/extractors/ci-evidence.js --repo /path/to/repo
```

All three write JSON to stdout and progress/errors to stderr.

## Requirements

- Node.js 18+
- `git` CLI on PATH (only required for `git-evidence`)
