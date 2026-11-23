#!/usr/bin/env bash
set -eu
: "${APP_KEY:?APP_KEY required}" "${GAME_SERVER_SECRET:?GAME_SERVER_SECRET required}" "${DB_URL:?DB_URL required}"
php backend/artisan migrate --force --seed
apache2-foreground &
api=$!
php backend/artisan schedule:work &
scheduler=$!
node --import tsx server/index.ts &
game=$!
trap 'kill "$api" "$scheduler" "$game" 2>/dev/null || true' EXIT
trap 'exit 0' TERM INT
wait -n "$api" "$scheduler" "$game"
exit 1
