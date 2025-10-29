#!/bin/bash
# Script to update CHANGELOG.md with a new version
# Usage: ./scripts/update-changelog.sh

set -e

CHANGELOG_FILE="docs/CHANGELOG.md"

# Generate version
DATE=$(date -u +"%Y.%-m.%-d")

# Get today's version count from git tags
TAG_COUNT=$(git tag -l "v${DATE}-*" | wc -l | tr -d ' ')
COUNTER=$((TAG_COUNT + 1))
COUNTER_FORMATTED=$(printf "%03d" $COUNTER)
VERSION="${DATE}-${COUNTER_FORMATTED}"

echo "📝 Updating CHANGELOG for version ${VERSION}..."

# Check if there's content in [Unreleased]
if ! grep -A 10 "## \[Unreleased\]" "$CHANGELOG_FILE" | grep -q "^###"; then
  echo "⚠️  No unreleased changes found in CHANGELOG.md"
  echo "Please add changes to the [Unreleased] section first."
  exit 1
fi

# Create temporary file with updated changelog
awk -v version="$VERSION" -v date="$(date -u +"%Y-%m-%d")" '
  /## \[Unreleased\]/ {
    print $0
    print ""
    print "### Added"
    print ""
    print "### Changed"
    print ""
    print "### Fixed"
    print ""
    print "### Improved"
    print ""
    print "## [" version "] - " date
    in_unreleased = 1
    next
  }
  /## \[/ && in_unreleased {
    in_unreleased = 0
  }
  !in_unreleased || !/^### (Added|Changed|Fixed|Improved)[[:space:]]*$/ {
    print $0
  }
' "$CHANGELOG_FILE" > "${CHANGELOG_FILE}.tmp"

# Update comparison links
sed -i.bak "s|\[Unreleased\]: https://github.com/AbhinayMe/directus-extension-getstream-io/compare/v.*\.\.\.HEAD|[Unreleased]: https://github.com/AbhinayMe/directus-extension-getstream-io/compare/v${VERSION}...HEAD|" "${CHANGELOG_FILE}.tmp"

# Find previous version for comparison link
PREV_VERSION=$(grep -E '^\[.*\]:.*compare' "$CHANGELOG_FILE" | head -1 | sed -E 's/.*compare\/v([^.]+\.[^.]+\.[^-]+-[0-9]+)\.\.\..*/\1/')

if [ -n "$PREV_VERSION" ]; then
  # Insert new version comparison link
  sed -i.bak "/\[Unreleased\]:/a\\
[${VERSION}]: https://github.com/AbhinayMe/directus-extension-getstream-io/compare/v${PREV_VERSION}...v${VERSION}
" "${CHANGELOG_FILE}.tmp"
fi

# Replace original file
mv "${CHANGELOG_FILE}.tmp" "$CHANGELOG_FILE"
rm -f "${CHANGELOG_FILE}.bak" "${CHANGELOG_FILE}.tmp.bak"

echo "✅ CHANGELOG.md updated with version ${VERSION}"
echo ""
echo "Next steps:"
echo "  1. Review the changes: git diff $CHANGELOG_FILE"
echo "  2. Commit: git add $CHANGELOG_FILE && git commit -m 'chore: update changelog for v${VERSION}'"
echo "  3. Push to publish: git push origin publish"
