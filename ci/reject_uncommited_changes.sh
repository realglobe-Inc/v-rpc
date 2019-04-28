#!/bin/bash
#
# Reject if uncommited changes are detected

DIRS="$@"

CHANGED_FILES=$(git status --porcelain)

if [[ $CHANGED_FILES ]]; then
  echo ""
  echo "=== uncommited changes are detected ==="
  while read line; do
    echo "$line"
  done <<< ${CHANGED_FILES}
  echo ""
  git diff --color | cat
  exit 1
fi
