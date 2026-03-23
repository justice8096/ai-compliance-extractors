# Setup Instructions

The AI Compliance Extractors package includes scaffolding and CLI tools, but the actual extractor modules are large (~100KB total) and should be copied from the source repository.

## Step 1: Copy Extractor Modules

Copy the extractor scripts from D:\LLMComplianceSkill\tools\extractors\ to src/extractors/:

```bash
mkdir -p src/extractors
cp D:\LLMComplianceSkill\tools\extractors\git-evidence.js src/extractors/
cp D:\LLMComplianceSkill\tools\extractors\package-evidence.js src/extractors/
cp D:\LLMComplianceSkill\tools\extractors\ci-evidence.js src/extractors/
```

Or as a one-liner:

```bash
mkdir -p src/extractors && cp D:\LLMComplianceSkill\tools\extractors\*.js src/extractors/
```

## Step 2: Verify Installation

Run the CLI help to confirm setup:

```bash
node src/cli.js --help
```

You should see:
```
Usage: ai-compliance-extract --repo <path> [--output <path>] [--format json|markdown]
```

## Step 3: Test Extraction

```bash
node src/cli.js --repo /path/to/repo --output evidence.json
```

The output file should contain evidence from all three extractors.

## Troubleshooting

### "extractor not found" error

If you see this error, the extractor modules were not copied. Run:

```bash
mkdir -p src/extractors
cp D:\LLMComplianceSkill\tools\extractors\*.js src/extractors/
```

### Permission denied on extracted output

Some files may require elevated permissions to access. Run the extractor in the same shell as your repository.

## Integration

Once set up, you can use the package:

- **CLI**: `ai-compliance-extract --repo <path>`
- **Node.js**: `require('ai-compliance-extractors')`
- **Direct extractors**: `node src/extractors/git-evidence.js --repo <path>`

Extractors output JSON suitable for merging into compliance configuration files.
