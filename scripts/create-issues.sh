#!/usr/bin/env bash
# Creates the roadmap issues from docs/issues/*.md plus an epic tracking issue.
# Requires the GitHub CLI: `gh auth login` first.
# Usage: scripts/create-issues.sh [owner/repo]   (default: Pondws/Chat-App)
set -euo pipefail
REPO="${1:-Pondws/Chat-App}"
DIR="$(cd "$(dirname "$0")/.." && pwd)/docs/issues"
checklist="- [ ] #1 [Frontend]: Connect Login API (existing)"$'\n'

for f in "$DIR"/*.md; do
  title="$(head -n1 "$f" | sed 's/^# //')"
  body="$(tail -n +2 "$f")"
  url="$(gh issue create --repo "$REPO" --title "$title" --body "$body")"
  num="${url##*/}"
  echo "Created #$num  $title"
  checklist+="- [ ] #$num $title"$'\n'
done

epic_body="Tracking issue for building the Chat App from start to finish. See docs/ROADMAP.md for the suggested order.

$checklist"
gh issue create --repo "$REPO" --title "[Epic]: Chat App roadmap — start to finish" --body "$epic_body"
