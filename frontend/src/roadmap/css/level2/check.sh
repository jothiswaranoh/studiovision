#!/bin/bash
echo "🔤 Checking your text styles..."

if grep -q "font-family" style.css || grep -q "font-size" style.css || grep -q "text-align" style.css; then
    echo ""
    echo "🎉 ✅ Level 2 PASSED! Your text looks amazing!"
    echo "✨ You're mastering typography!"
    
    # Specific checks
    if grep -q "font-family" style.css; then
        echo "⭐ You changed fonts - great choice!"
    fi
    if grep -q "text-align" style.css; then
        echo "⭐ You aligned text - nice layout skills!"
    fi
else
    echo ""
    echo "❌ Missing text styling properties"
    echo "💡 Try adding to style.css:"
    echo "   h1 { font-family: Arial; text-align: center; }"
    echo "   p { font-size: 18px; }"
fi
