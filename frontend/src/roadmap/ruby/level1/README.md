# 🎯 Level 1: Ruby Basics & Variables 💎

**Your Mission:** Learn Ruby fundamentals - variables, data types, and basic operations.

**What You'll Learn:**
- Ruby syntax and conventions
- Variables and data types
- Basic operations and input/output
- String manipulation

**Why Ruby is Awesome:**
- Beautiful, readable syntax
- Everything is an object
- Developer happiness focused
- Great for web development and scripting

**Variables & Data Types:**
```ruby
# Strings (text)
name = "Alice"
message = 'Hello World'

# Numbers
age = 25
height = 5.9
is_student = true

# Arrays
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]

# Symbols (unique identifiers)
status = :active
color = :red
```

**Basic Operations:**
```ruby
# Math operations
sum = 5 + 3       # 8
difference = 10 - 4 # 6
product = 3 * 4    # 12
quotient = 15 / 3  # 5

# String operations
greeting = "Hello" + " " + "World"  # "Hello World"
name_length = "Alice".length        # 5

# String interpolation
name = "Alice"
message = "Hello, #{name}!"  # "Hello, Alice!"
```

**Input/Output:**
```ruby
# Getting user input
print "What's your name? "
name = gets.chomp

# Displaying output
puts "Hello, " + name
puts "Hello, #{name}!"  # String interpolation
```

**Ruby Conventions:**
- Use `snake_case` for variables and methods
- Use `PascalCase` for classes
- Parentheses are often optional
- `puts` adds newline, `print` doesn't

**Challenge:**
Create variables to store your information and practice basic operations.

**Run `bash check.sh` to test your Ruby basics!**
