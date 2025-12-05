#!/bin/bash
echo "📱 Checking your responsive design..."

if grep -q "@media" style.css || grep -q "display: grid" style.css || grep -q "fr" style.css; then
    echo ""
    echo "🎉 ✅ Level 5 PASSED! You're building responsive websites!"
    echo "🌐 Your sites will work on all devices!"
    
    # Check for specific features
    if grep -q "@media" style.css; then
        echo "⭐ You're using media queries - responsive!"
    fi
    if grep -q "display: grid" style.css; then
        echo "⭐ You're using CSS Grid - powerful layouts!"
    fi
    if grep -q "fr" style.css; then
        echo "⭐ You're using fractional units - flexible!"
    fi
else
    echo ""
    echo "❌ Missing responsive features"
    echo "💡 Try adding:"
    echo "   .gallery { display: grid; grid-template-columns: 1fr 1fr; }"
    echo "   @media (min-width: 768px) { ... }"
fi
