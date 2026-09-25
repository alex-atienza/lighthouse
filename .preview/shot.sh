#!/bin/sh
# Usage: sh shot.sh <route> <name> [height]
# Screenshots a route of the running dev server into .preview/<name>.png
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
DIR="/Users/aatienza/Documents/Claude/Projects/Lighthouse/.preview"
H="${3:-1300}"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,"$H" \
  --virtual-time-budget=6000 --screenshot="$DIR/$2.png" "http://localhost:5173$1" >/dev/null 2>&1
echo "shot $2 -> exit $? ($(du -h "$DIR/$2.png" 2>/dev/null | cut -f1))"
