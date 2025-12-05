#!/bin/bash
echo "🐚 Starting Level 5 Challenge..."

echo "1. Create your first script (hello.sh):"
cat > hello.sh <<'SCRIPT'
#!/bin/bash
echo "Hello from my first script!"
SCRIPT

echo "2. Make it executable and run it:"
echo "   chmod +x hello.sh"
echo "   ./hello.sh"
echo ""
echo "3. Create a script with variables:"
cat > vars.sh <<'SCRIPT'
#!/bin/bash
name="Linux Student"
age=25
echo "Name: $name"
echo "Age: $age"
SCRIPT

echo "4. Create a script with user input:"
cat > interactive.sh <<'SCRIPT'
#!/bin/bash
read -p "What's your name? " username
echo "Welcome, $username!"
SCRIPT

echo "5. Create a script with conditionals:"
cat > checker.sh <<'SCRIPT'
#!/bin/bash
if [ -f "hello.sh" ]; then
    echo "hello.sh exists!"
else
    echo "hello.sh not found!"
fi
SCRIPT

echo "Script templates created! Try modifying and running them."
