#!/bin/bash
echo "🔍 Checking your links and images..."

if grep -qi "<a" index.html && grep -qi "<img" index.html; then
  echo ""
  echo "🎉 ✅ Level 3 PASSED! You're connecting the web!"
  echo "🔗 You can now link pages and show images!"
  
  # Bonus check for alt text
  if grep -qi "alt=" index.html; then
    echo "⭐ Bonus: You included alt text - great for accessibility!"
  else
    echo "💡 Remember to add 'alt' text to your images for screen readers"
  fi
else
  echo ""
  echo "❌ Missing either links or images"
  echo "💡 Try adding:"
  echo "   <a href='https://google.com'>Visit a website</a>"
  echo "   <img src='https://placekitten.com/200/300' alt='Cute kitten'>"
fi
