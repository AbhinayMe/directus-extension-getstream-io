# Scripts

## update-changelog.sh

Automatically updates `docs/CHANGELOG.md` by moving `[Unreleased]` content to a new version section.

### Usage

```bash
# Run directly
./scripts/update-changelog.sh

# Or via yarn
yarn changelog
```

### What it does

1. Generates the next version number based on today's date (`YYYY.M.D-NNN`)
2. Checks for unreleased changes in `docs/CHANGELOG.md`
3. Creates a new version section with the unreleased content
4. Resets the `[Unreleased]` section with empty subsections
5. Updates version comparison links at the bottom

### Example

**Before:**

```markdown
## [Unreleased]

### Added

- New feature X

### Fixed

- Bug Y
```

**After running script:**

```markdown
## [Unreleased]

### Added

### Changed

### Fixed

### Improved

## [2025.10.30-001] - 2025-10-30

### Added

- New feature X

### Fixed

- Bug Y
```

### Workflow

1. Make your changes and add them to `[Unreleased]` in CHANGELOG
2. Run `yarn changelog` to update CHANGELOG with version
3. Review: `git diff docs/CHANGELOG.md`
4. Commit: `git add docs/CHANGELOG.md && git commit -m "chore: update changelog"`
5. Push to trigger publish: `git push origin publish`
