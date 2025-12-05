#!/bin/bash
echo "🔍 Checking your Level 1 solution..."

if grep -q "<h1>Welcome to the Web Solver!</h1>" index.html; then
  echo ""
  echo "🎉 ✅ Level 1 PASSED! Amazing job!"
  echo "✨ You've created your first webpage!"
  echo ""
  echo "Next: Try adding a <p> paragraph tag too!"
else
  echo ""
  echo "❌ Not quite right yet."
  echo "💡 Remember to add: <h1>Welcome to the Web Solver!</h1>"
  echo "   inside the <body> section of your HTML"
fi
