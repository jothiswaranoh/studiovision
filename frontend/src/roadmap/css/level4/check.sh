#!/bin/bash
echo "📐 Checking your Flexbox skills..."

if grep -q "display: flex" style.css || grep -q "display: flex" style.css; then
    echo ""
    echo "🎉 ✅ Level 4 PASSED! You're a Flexbox master!"
    echo "💪 You can create modern layouts!"
    
    # Check for common flex properties
    if grep -q "justify-content" style.css; then
        echo "⭐ You're aligning content horizontally!"
    fi
    if grep -q "align-items" style.css; then
        echo "⭐ You're aligning content vertically!"
    fi
    if grep -q "flex-direction" style.css; then
        echo "⭐ You're controlling flex direction!"
    fi
else
    echo ""
    echo "❌ No Flexbox found"
    echo "💡 Try adding:"
    echo "   .navbar { display: flex; justify-content: space-between; }"
    echo "   .hero-section { display: flex; justify-content: center; align-items: center; }"
fi
