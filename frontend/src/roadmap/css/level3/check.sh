#!/bin/bash
echo "📦 Checking your box model skills..."

if grep -q "margin" style.css || grep -q "padding" style.css || grep -q "border" style.css; then
    echo ""
    echo "🎉 ✅ Level 3 PASSED! You understand the box model!"
    echo "📐 You can control spacing like a pro!"
    
    # Count properties used
    properties=0
    if grep -q "margin" style.css; then ((properties++)); fi
    if grep -q "padding" style.css; then ((properties++)); fi
    if grep -q "border" style.css; then ((properties++)); fi
    
    echo "⭐ You used $properties/3 box model properties!"
else
    echo ""
    echo "❌ Missing box model properties"
    echo "💡 Try adding to style.css:"
    echo "   .box { margin: 10px; padding: 15px; border: 1px solid black; }"
fi
