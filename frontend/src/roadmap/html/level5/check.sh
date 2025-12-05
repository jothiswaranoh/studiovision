#!/bin/bash
echo "🔍 Checking your table structure..."

if grep -qi "<table" index.html && grep -qi "<tr" index.html && grep -qi "<td" index.html; then
  echo ""
  echo "🎉 ✅ Level 5 PASSED! You can organize data!"
  echo "📊 Tables help present information clearly!"
  
  # Bonus check for lists
  if grep -qi "<ul\|<ol" index.html; then
    echo "📝 Bonus: You also included lists - versatile!"
  fi
else
  echo ""
  echo "❌ Missing table elements"
  echo "💡 Try building a simple 2x2 table:"
  echo "   <table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>"
  echo "   Or create a list with <ul><li>Item</li></ul>"
fi
