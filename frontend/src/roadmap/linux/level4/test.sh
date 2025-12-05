#!/bin/bash
echo "🔒 Testing Permissions & Process Management..."

# Test basic permission commands
echo "Testing user identification..."
if whoami > /dev/null 2>&1; then
    echo "✅ whoami command working"
else
    echo "❌ whoami command failed"
fi

# Test process monitoring
echo "Testing process monitoring..."
if ps aux > /dev/null 2>&1; then
    echo "✅ process monitoring working"
else
    echo "❌ process monitoring failed"
fi

# Test file permission operations
echo "Testing file permissions..."
touch test_script.sh
echo '#!/bin/bash' > test_script.sh
echo 'echo "test"' >> test_script.sh

# Make executable
chmod +x test_script.sh
if [ -x "test_script.sh" ]; then
    echo "✅ file permission modification working"
else
    echo "❌ file permission modification failed"
fi

# Test system resource commands
echo "Testing system resource commands..."
if free -h > /dev/null 2>&1; then
    echo "✅ memory monitoring working"
else
    echo "❌ memory monitoring failed"
fi

if df -h > /dev/null 2>&1; then
    echo "✅ disk space monitoring working"
else
    echo "❌ disk space monitoring failed"
fi

# Cleanup
rm -f test_script.sh

echo ""
echo "🎉 Level 4 COMPLETED! You can manage system security and processes!"
echo "⚡ You understand Linux permissions and process control!"
