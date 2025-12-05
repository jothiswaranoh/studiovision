#!/bin/bash
echo "🎨 Checking your colors..."

if grep -q "color:" index.html || grep -q "background-color:" index.html; then
    echo ""
    echo "🎉 ✅ Level 1 PASSED! You're adding color to the web!"
    echo "🌈 Great job learning CSS basics!"
    
    # Bonus checks
    if grep -q "h1" index.html && grep -q "color" index.html; then
        echo "⭐ You styled headings - excellent start!"
    fi
else
    echo ""
    echo "❌ No colors found yet"
    echo "💡 Try adding:"
    echo "   h1 { color: blue; }"
    echo "   body { background-color: lightgray; }"
    echo "   inside the <style> tags"
fi
