# Attribution

> Record of human and AI contributions to this project.

## Project

- **Name:** ai-compliance-extractors
- **Repository:** https://github.com/justice8096/ai-compliance-extractors
- **Started:** 2025 (embedded in LLMComplianceSkill)

---

## Contributors

### Human

| Name | Role | Areas |
|------|------|-------|
| Justice E. Chase | Lead developer | Architecture, design, domain logic, review, integration |

### AI Tools Used

| Tool | Model/Version | Purpose |
|------|---------------|---------|
| Claude | Claude Opus 4.6 | Code generation, documentation, testing, research |
| Claude Code | — | Agentic development, refactoring, extraction |

---

## Contribution Log

### Original Source Code
Extracted from LLMComplianceSkill/tools/extractors/. Justice designed the evidence extraction approach, git/package/CI analysis categories, and zero-dependency constraint. The extractors map to real compliance frameworks Justice researched extensively.

| Date | Tag | Description | AI Tool | Human Review |
|------|-----|-------------|---------|--------------|
| 2025-2026 | `human-only` | Evidence extraction architecture, git/package/CI analysis categories, compliance framework mapping | — | Justice E. Chase |

### Standalone Extraction

| Date | Tag | Description | AI Tool | Human Review |
|------|-----|-------------|---------|--------------|
| 2026-03-21 | `ai-assisted` | Extracted from LLMComplianceSkill into standalone repo | Claude Code | Architecture decisions, reviewed all code |
| 2026-03-21 | `ai-generated` | Package config, CI/CD workflows, LICENSE | Claude Code | Reviewed and approved |
| 2026-03-21 | `ai-generated` | README documentation | Claude Code | Reviewed, edited |

### Improvements (2026-03-23)

| Date | Tag | Description | AI Tool | Human Review |
|------|-----|-------------|---------|--------------|
| 2026-03-23 | `ai-assisted` | Fixed command injection vulnerability (execSync → execFileSync) | Claude Code | Reviewed and approved |
| 2026-03-23 | `ai-assisted` | Added --format flag with markdown/HTML formatters | Claude Code | Reviewed and approved |
| 2026-03-23 | `ai-generated` | Comprehensive test suite (50+ tests) | Claude Code | Reviewed and approved |
| 2026-03-23 | `ai-generated` | README rewrite with framework documentation | Claude Code | Reviewed and edited |

---

## Commit Convention

Include `[ai:claude]` tag in commit messages for AI-assisted or AI-generated changes. Example:
```
Extract compliance extractors with format support [ai:claude]
```

---

## Disclosure Summary

| Category | Approximate % |
|----------|---------------|
| Human-only code | 30% |
| AI-assisted code | 30% |
| AI-generated (reviewed) | 40% |
| Documentation | 85% AI-assisted |
| Tests | 95% AI-generated |

---

## Notes

- All AI-generated or AI-assisted code is reviewed by a human contributor before merging.
- AI tools do not have repository access or commit privileges.
- This file is maintained manually and may not capture every interaction.
- Original source code was embedded in LLMComplianceSkill before extraction.
- Security improvement: Command injection vulnerability fixed during extraction.

---

## License Considerations

AI-generated content may have different copyright implications depending on jurisdiction. See [LICENSE](./LICENSE) for this project's licensing terms. Contributors are responsible for ensuring AI-assisted work complies with applicable policies.
