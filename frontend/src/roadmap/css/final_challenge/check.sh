#!/bin/bash
echo "🎨 Reviewing your CSS masterpiece..."

required=("color" "font-family" "margin" "padding" "display: flex" "display: grid")
bonus=("@media" "hover" "transition" "transform" "box-shadow" "gradient")
score=0
total=6

echo ""
echo "📋 Required CSS Concepts Check:"

for concept in "${required[@]}"; do
    if grep -q "$concept" style.css; then
        echo "✅ $concept - Found!"
        ((score++))
    else
        echo "❌ $concept - Missing"
    fi
done

echo ""
echo "⭐ Bonus Features:"
bonus_count=0
for bonus_item in "${bonus[@]}"; do
    if grep -q "$bonus_item" style.css; then
        echo "   ✅ $bonus_item"
        ((bonus_count++))
    fi
done

echo ""
if [ $score -eq $total ]; then
    echo "🎉 🏆 CSS MASTER ACHIEVED! 🏆"
    echo "✨ You are now a CSS developer!"
    echo ""
    echo "You've successfully mastered:"
    echo "• Colors & Typography"
    echo "• Box Model & Spacing" 
    echo "• Flexbox & Grid Layouts"
    echo "• Responsive Design"
    echo "• Beautiful Styling"
    echo ""
    echo "Bonus features: $bonus_count/6"
    echo ""
    echo "What's next? Learn JavaScript for interactivity!"
else
    echo "📊 Score: $score/$total required concepts"
    echo "💡 Almost there! Add the missing CSS concepts."
    echo "🎨 Remember: CSS is about creativity and practice!"
fi
