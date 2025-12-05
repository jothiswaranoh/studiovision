#!/bin/bash
echo "🔍 Testing Level 1 Skills..."

# Test basic navigation skills
if pwd > /dev/null 2>&1; then
    echo "✅ You can use 'pwd' command"
else
    echo "❌ 'pwd' command failed"
fi

if ls > /dev/null 2>&1; then
    echo "✅ You can use 'ls' command"
else
    echo "❌ 'ls' command failed"
fi

# Check if practice directory exists
if [ -d "practice" ]; then
    echo "✅ 'practice' directory exists"
else
    echo "❌ 'practice' directory not found - create it with 'mkdir practice'"
fi

# Check if hello.txt exists in practice directory
if [ -f "practice/hello.txt" ]; then
    echo "✅ 'hello.txt' file exists in practice directory"
    echo ""
    echo "🎉 Level 1 COMPLETED! You've mastered basic navigation!"
    echo "📁 You can now move around the Linux file system!"
else
    echo "❌ 'hello.txt' not found in practice directory"
    echo ""
    echo "💡 Remember to:"
    echo "   1. Create 'practice' directory: mkdir practice"
    echo "   2. Enter it: cd practice"
    echo "   3. Create file: touch hello.txt"
fi
