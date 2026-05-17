<!-- SPDX-License-Identifier: CC0-1.0 -->

# Changelog

All notable changes to this library are tracked here. Per the [Skill Versioning and Addendum Framework](https://github.com/justice8096/SecondBrainData/blob/main/SoftwarePractices/Skill-Versioning-and-Addendum-Framework.md), every change is classified by driver so downstream audit-artifact consumers can assess whether prior outputs need addendum filings.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) with **change-driver tags** appended per entry:

- `[authority]` — underlying regulation, standard, or evidence base changed
- `[defect]` — typo, broken citation, misspelled term, wrong CFR number, factual error
- `[structural]` — section restructure, new locale, new lifespan layer, new domain, new severity scale
- `[voice]` — wording refinement, tone adjustment, ambiguity fix, accessibility improvement

All four drivers affect admissibility / persuasive weight of downstream artifacts. Every change is tracked equally.

## [Unreleased]

## [1.1.0] — 2026-05-17

Skill Versioning and Addendum Framework integration. Aligns ai-compliance-extractors with the framework piloted in dyscalculia-support-skill v1.3.0–v1.3.2 and applied to dyslexia-support-skill v1.3.0 and LLMComplianceSkill v1.2.0.

### Added `[structural]`
- `CHANGELOG.md` (this file) adopting the four-driver classification with retroactive entries for v1.0.0.
- Inline "*Sources current as of 2026-05*" markers + authority-version pins per major regulatory section in `skills/ai-compliance/SKILL.md`.
- Inline "*Sources current as of 2026-05*" markers + authority-version pins for security-scan databases and standards in `skills/security-scan/SKILL.md`.

### Added `[authority]`
- Authority-version pins in `skills/ai-compliance/SKILL.md`: EU AI Act (Regulation (EU) 2024/1689, in force 2024-08-01, prohibitions effective 2025-02-02, GPAI obligations 2025-08-02, full applicability 2026-08-02), GDPR (Regulation (EU) 2016/679), NIST AI Risk Management Framework 1.0 (2023-01) + Generative AI Profile NIST AI 600-1 (2024-07), ISO/IEC 42001:2023, ISO/IEC 23894:2023.
- Authority-version pins in `skills/security-scan/SKILL.md`: OWASP LLM Top 10 (v1.1 — 2024-10), OWASP Top 10:2021, MITRE ATLAS (v4.7.0 — 2025-01), NIST SP 800-218A (Secure Software Development Framework, 2024-02), CWE Top 25 (2024 release).

### Process notes
- Library and embedded skill versions bumped 1.0.0 → 1.1.0 in lockstep (package.json + 3 SKILL.md frontmatter versions). No behavior changes to extractors or CLI.
- Release is gated on the existing `release.yml` workflow which auto-publishes to npm on `v*` tag push.

## [1.0.0] — 2026-05-16

Initial npm publish as [`@justice8096/ai-compliance-extractors`](https://www.npmjs.com/package/@justice8096/ai-compliance-extractors).

### Added `[structural]`
- Git evidence extractor (`src/extractors/git-evidence.js`): commit history analysis, AI attribution detection, security practices, code review patterns.
- Package evidence extractor (`src/extractors/package-evidence.js`): npm / pip / cargo / go / composer / maven / gradle dependency analysis with vulnerability flags.
- CI/CD evidence extractor (`src/extractors/ci-evidence.js`): GitHub Actions / GitLab CI / Azure DevOps pipeline analysis with security scanning and SLSA level assessment.
- CLI runner (`src/cli.js`) with JSON / Markdown / HTML output formats.
- Two embedded skills: `skills/ai-compliance/` (AI compliance evidence collection knowledge base, references EU AI Act, GDPR, NIST AI RMF) and `skills/security-scan/` (OWASP LLM Top 10, dependency CVE, SAST patterns, secrets scanning).
- Vitest test suite with structural validation, schema coverage, idempotency checks.
- Tag-triggered `release.yml` workflow publishes to npm + creates GitHub Release.
- Backported `validateRepoPath` / `timeout` / `.filter(Boolean)` / `@ai-generated` markers from LLMComplianceSkill local extractor copies during publish-readiness pass.
- Rescoped from unscoped name to `@justice8096/` scope.

### Fixed `[defect]`
- Removed `release.yml` "skipped" string that previously masked npm publish failures (commit `c7dd7be`).
- Fixed `ci.yml` to target `master` branch instead of `main` after default-branch renaming.

### Changed `[voice]`
- License migrated from MIT to CC0 1.0 Universal across all source files.

---

## Change-driver workflow

When making a change:

1. **Classify the driver** — one of `[authority]`, `[defect]`, `[structural]`, `[voice]`.
2. **Cite the trigger** — for `[authority]`: name the law/standard/study/CVE/CWE that changed. For `[defect]`: describe what was wrong. For `[structural]`/`[voice]`: explain why.
3. **Estimate addendum burden** — would any prior generated evidence package (JSON/Markdown/HTML extractor output) need re-running as a result of this change? If yes, flag it; consumers like LLMComplianceSkill rely on extractor versioning to decide when to refresh evidence.

## Audit-artifact provenance

Every extractor output (JSON, Markdown, HTML) should include a provenance block of the form:

```
Generated YYYY-MM-DD by @justice8096/ai-compliance-extractors vX.Y.Z (<git-short-hash>)
Sources current as of YYYY-MM except where individual sections note otherwise.
Standards versions: OWASP LLM Top 10 v1.1, MITRE ATLAS v4.7.0, NIST SP 800-218A 2024-02, etc.
Library changelog: https://github.com/justice8096/ai-compliance-extractors/blob/master/CHANGELOG.md
```

A future minor release will add this stamp directly to extractor output. For now, consumers should record the library version in their own audit artifacts via `npm list @justice8096/ai-compliance-extractors`.

## Related framework documentation

- [Skill Versioning and Addendum Framework](https://github.com/justice8096/SecondBrainData/blob/main/SoftwarePractices/Skill-Versioning-and-Addendum-Framework.md) — the cross-skill engineering principle this CHANGELOG implements.
- [Master Task List entry 17](https://github.com/justice8096/SecondBrainData) — rollout plan to other inspection-and-documentation skills (`post-commit-audit`, `supply-chain-security`, `sast-dast-scanner`, `cwe-mapper`).
- [Sister skill: LLMComplianceSkill](https://github.com/justice8096/LLMComplianceSkill) — the larger sibling that consumes this library; framework integration landed there in v1.2.0.
- [Pilot skill: dyscalculia-support-skill](https://github.com/justice8096/dyscalculia-support-skill) — pilot implementation of this framework.
