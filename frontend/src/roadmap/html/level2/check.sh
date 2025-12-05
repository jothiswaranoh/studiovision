#!/bin/bash
echo "🔍 Checking your Level 2 structure..."

tags=("header" "nav" "main" "section" "footer")
missing_tags=()

for tag in "${tags[@]}"; do
  if ! grep -qi "<$tag" index.html; then
    missing_tags+=("$tag")
  fi
done

if [ ${#missing_tags[@]} -eq 0 ]; then
  echo ""
  echo "🎉 ✅ Level 2 PASSED! Excellent structure!"
  echo "🏗️  You're building solid web foundations!"
else
  echo ""
  echo "❌ Missing these tags: ${missing_tags[*]}"
  echo "💡 Try adding: <${missing_tags[0]}>Your content here</${missing_tags[0]}>"
fi
