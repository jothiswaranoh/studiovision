#!/bin/bash
echo "🐚 Testing Shell Scripting Skills..."

# Test basic script creation
echo "Testing script creation..."
cat > test_script.sh <<'SCRIPT'
#!/bin/bash
echo "Script is working!"
name="TestUser"
echo "Welcome, $name!"
SCRIPT

chmod +x test_script.sh
if ./test_script.sh | grep -q "working"; then
    echo "✅ Basic scripting working"
else
    echo "❌ Basic scripting failed"
fi

# Test variable functionality
echo "Testing variables..."
if ./test_script.sh | grep -q "TestUser"; then
    echo "✅ Variable usage working"
else
    echo "❌ Variable usage failed"
fi

# Test conditional logic
echo "Testing conditionals..."
cat > test_conditional.sh <<'SCRIPT'
#!/bin/bash
if [ -f "test_script.sh" ]; then
    echo "FILE_EXISTS"
else
    echo "FILE_MISSING"
fi
SCRIPT

chmod +x test_conditional.sh
if ./test_conditional.sh | grep -q "FILE_EXISTS"; then
    echo "✅ Conditional logic working"
else
    echo "❌ Conditional logic failed"
fi

# Test loop functionality
echo "Testing loops..."
cat > test_loop.sh <<'SCRIPT'
#!/bin/bash
for i in 1 2 3; do
    echo "ITERATION_$i"
done
SCRIPT

chmod +x test_loop.sh
if ./test_loop.sh | grep -c "ITERATION" | grep -q "3"; then
    echo "✅ Loop functionality working"
else
    echo "❌ Loop functionality failed"
fi

# Cleanup
rm -f test_script.sh test_conditional.sh test_loop.sh

echo ""
echo "🎉 Level 5 COMPLETED! You can now automate tasks with scripts!"
echo "🚀 You're officially a Linux shell scripter!"
