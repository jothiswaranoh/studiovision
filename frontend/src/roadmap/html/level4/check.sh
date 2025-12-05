#!/bin/bash
echo "🔍 Checking your form..."

if grep -qi "<form" index.html && grep -qi "<input" index.html && grep -qi "<button" index.html; then
  echo ""
  echo "🎉 ✅ Level 4 PASSED! You can build forms!"
  echo "📝 Users can now interact with your webpage!"
  
  # Check for password field
  if grep -qi "password" index.html; then
    echo "🔒 Great! You included a password field for security!"
  fi
else
  echo ""
  echo "❌ Missing form elements"
  echo "💡 Your form needs: <form>, <input>, and <button> tags"
  echo "   Try creating email and password fields!"
fi
