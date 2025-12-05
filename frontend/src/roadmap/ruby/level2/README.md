# 🎯 Level 2: Methods & Control Flow ⚙️

**Your Mission:** Learn to create methods and make decisions in your code.

**What You'll Learn:**
- Defining and calling methods
- If/else statements
- Loops and iterators
- Method parameters and return values

**Methods (Reusable Code Blocks):**
```ruby
# Method definition
def greet(name)
  "Hello, #{name}!"
end

# Method call
message = greet("Alice")
puts message  # "Hello, Alice!"

# Implicit return - last expression is returned
def add(a, b)
  a + b  # This is automatically returned
end
```

**Conditional Statements:**
```ruby
age = 18

if age >= 18
  puts "You can vote!"
elsif age >= 16
  puts "You can drive!"
else
  puts "You're too young."
end

# One-liner conditionals
puts "You're an adult" if age >= 18
```

**Loops and Iterators:**
```ruby
# Each iterator (preferred in Ruby)
fruits = ["apple", "banana", "orange"]
fruits.each do |fruit|
  puts fruit
end

# While loop
count = 0
while count < 5
  puts count
  count += 1
end

# Times iterator
5.times do |i|
  puts "Iteration #{i}"
end
```

**Comparison Operators:**
- `==` Equal to
- `!=` Not equal to
- `>` Greater than
- `<` Less than
- `>=` Greater than or equal to
- `<=` Less than or equal to

**Boolean Operators:**
- `&&` AND
- `||` OR
- `!` NOT

**Challenge:**
Create methods that make decisions and process data.

**Run `bash check.sh` to test your Ruby logic skills!**
