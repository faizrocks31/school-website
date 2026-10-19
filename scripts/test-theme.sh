#!/usr/bin/env bash
# Non-destructive theme test: switches theme, verifies the site picks it up,
# then restores the original theme whatever happens.
set -u
cd "C:/Users/hp/Documents/Claude Project/School Website"

TOKEN="${ADMIN_TOKEN:-admin123}"
H=(-H "x-admin-token: $TOKEN")

echo "=== 1. GET /api/admin/theme (unauthenticated should be 401) ==="
curl -s -o /dev/null -w "  no auth -> HTTP %{http_code}\n" --max-time 60 http://localhost:3000/api/admin/theme

echo "=== 2. GET with auth ==="
BEFORE=$(curl -s --max-time 60 "${H[@]}" http://localhost:3000/api/admin/theme)
ORIG=$(printf '%s' "$BEFORE" | grep -o '"current":"[^"]*"' | cut -d'"' -f4)
echo "  original theme: $ORIG"
echo "  theme count: $(printf '%s' "$BEFORE" | grep -o '"id":' | wc -l)"

echo "=== 3. reject an unknown theme ==="
curl -s -w "  -> HTTP %{http_code}\n" --max-time 60 "${H[@]}" -X PATCH \
  -H "Content-Type: application/json" -d '{"theme":"not-a-real-theme"}' \
  http://localhost:3000/api/admin/theme

echo "=== 4. switch to 'emerald' ==="
curl -s -w "  -> HTTP %{http_code}\n" --max-time 60 "${H[@]}" -X PATCH \
  -H "Content-Type: application/json" -d '{"theme":"emerald"}' \
  http://localhost:3000/api/admin/theme

echo "=== 5. public site reflects it? (expect emerald 6 95 70) ==="
sleep 1
curl -s --max-time 60 http://localhost:3000/ | grep -o '<style id="brand-theme">[^<]*</style>'

echo "=== 6. restore original theme '$ORIG' ==="
curl -s -w "  -> HTTP %{http_code}\n" --max-time 60 "${H[@]}" -X PATCH \
  -H "Content-Type: application/json" -d "{\"theme\":\"$ORIG\"}" \
  http://localhost:3000/api/admin/theme
sleep 1
echo "=== 7. confirm restored ==="
curl -s --max-time 60 http://localhost:3000/ | grep -o '<style id="brand-theme">[^<]*</style>'
