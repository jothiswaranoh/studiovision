#!/bin/bash
echo "🔍 Reviewing your final portfolio..."

required=("header" "nav" "img" "form")
bonus=("alt=" "ul" "table" "footer")
score=0
total=4

echo ""
echo "📋 Required Elements Check:"

for tag in "${required[@]}"; do
  if grep -qi "<$tag" index.html; then
    echo "✅ <$tag> - Found!"
    ((score++))
  else
    echo "❌ <$tag> - Missing"
  fi
done

echo ""
echo "⭐ Bonus Elements:"
for bonus_item in "${bonus[@]}"; do
  if grep -qi "$bonus_item" index.html; then
    echo "   ✅ $bonus_item"
  fi
done

echo ""
if [ $score -eq $total ]; then
  echo "🎉 🏆 FINAL CHALLENGE PASSED! 🏆"
  echo "✨ You are now an HTML developer!"
  echo ""
  echo "You've successfully learned:"
  echo "• HTML Structure & Semantics"
  echo "• Links & Images" 
  echo "• Forms & User Input"
  echo "• Tables & Data Organization"
  echo "• Building complete webpages!"
  echo ""
  echo "What's next? Learn CSS to make your pages beautiful!"
else
  echo "📊 Score: $score/$total required elements"
  echo "💡 Almost there! Add the missing elements above."
  echo "🤔 Need help? Review the previous levels!"
fi
