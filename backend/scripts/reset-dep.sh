#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> Backend"
cd "$root/backend"
rm -rf node_modules package-lock.json
npm install

echo "==> Frontend"
cd "$root/frontend"
rm -rf node_modules package-lock.json
npm install

echo "==> Done. Commit the new lock files:"
echo "git add backend/package-lock.json frontend/package-lock.json"
echo "git commit -m 'Sync lock files' && git push"
