# 🎯 Level 5: Shell Scripting Basics 🐚

**Your Mission:** Learn to automate tasks with shell scripting.

**What You'll Learn:**
- Writing and executing shell scripts
- Variables and user input
- Conditional statements
- Loops and functions
- Exit codes and error handling

**Script Structure:**
```bash
#!/bin/bash
# This is a comment
echo "Hello World!"

# Variables
name="Linux Learner"
echo "Welcome, $name!"

# User input
read -p "Enter your name: " username
echo "Hello, $username!"

# Conditionals
if [ -f "file.txt" ]; then
    echo "File exists!"
else
    echo "File not found!"
fi

# Loops
for i in {1..5}; do
    echo "Number: $i"
done

# Functions
greet() {
    echo "Hello, $1!"
}
greet "World"
```

**Essential Scripting Concepts:**
- `#!/bin/bash` - Shebang line (tells system this is a bash script)
- Variables: `variable="value"`
- Conditionals: `if [ condition ]; then ... fi`
- Loops: `for`, `while`, `until`
- Functions: `function_name() { commands }`
- Exit codes: `exit 0` (success), `exit 1` (error)

**Common Tests:**
- `[ -f file ]` - File exists and is regular file
- `[ -d dir ]` - Directory exists
- `[ -r file ]` - File is readable
- `[ $a -eq $b ]` - Numbers are equal
- `[ "$str1" = "$str2" ]` - Strings are equal

**Challenge Tasks:**
1. Create your first shell script
2. Add variables and user interaction
3. Implement conditional logic
4. Create loops for repetition
5. Write reusable functions

**Run `bash check.sh` to test your scripting skills!**
