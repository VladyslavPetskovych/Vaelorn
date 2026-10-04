#!/bin/sh
# Runs on the server: pull the latest main and rebuild the containers.
set -eu
cd "$(dirname "$0")/.."

git fetch --quiet origin main
git reset --hard --quiet origin/main
docker compose up -d --build --remove-orphans

for i in $(seq 1 30); do
  if curl -sf localhost:3000/api/health >/dev/null; then
    echo "Deployed $(git log --oneline -1)"
    docker image prune -f >/dev/null
    exit 0
  fi
  sleep 2
done

echo "Health check failed" >&2
docker compose logs --tail 50 app >&2
exit 1
