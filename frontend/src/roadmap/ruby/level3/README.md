# 🎯 Level 3: Ruby Data Structures 🗂️

**Your Mission:** Master arrays, hashes, and ranges for organizing data.

**What You'll Learn:**
- Arrays and their methods
- Hashes (key-value pairs)
- Ranges and sequences
- Symbols and their uses
- Enumerable methods

**Arrays - Ordered Collections:**
```ruby
# Creating arrays
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", true, 3.14]

# Array operations
fruits << "grape"          # Add to end
fruits.push("mango")       # Add to end
fruits.unshift("kiwi")     # Add to beginning
fruits.pop                 # Remove and return last item
fruits.shift               # Remove and return first item

# Array methods
fruits.include?("apple")   # true
fruits.length              # 5
fruits.sort                # sorted array
fruits.reverse             # reversed array

# Array iteration
fruits.each { |fruit| puts fruit }
fruits.map { |fruit| fruit.upcase }
fruits.select { |fruit| fruit.length > 5 }
```

**Hashes - Key-Value Pairs:**
```ruby
# Creating hashes
person = {
  name: "Alice",
  age: 25,
  city: "New York"
}

# Or with rocket syntax
person = {
  "name" => "Alice",
  "age" => 25,
  "city" => "New York"
}

# Accessing values
puts person[:name]        # "Alice"
puts person["age"]        # 25
puts person.fetch(:city, "Unknown")  # "New York" with default

# Modifying hashes
person[:email] = "alice@example.com"  # Add new key
person[:age] = 26                     # Update value
person.delete(:city)                  # Remove key

# Hash methods
person.keys     # [:name, :age, :email]
person.values   # ["Alice", 26, "alice@example.com"]
person.empty?   # false
```

**Ranges:**
```ruby
# Creating ranges
numbers = 1..10      # 1 to 10 (inclusive)
letters = 'a'..'z'   # All lowercase letters
exclusive = 1...10   # 1 to 9 (exclusive)

# Using ranges
(1..5).each { |n| puts n }
(1..10).to_a         # Convert to array: [1, 2, 3, ..., 10]
('a'..'f').to_a      # ['a', 'b', 'c', 'd', 'e', 'f']
```

**Symbols:**
```ruby
# Symbols are lightweight strings
status = :active
color = :red

# They're great for hash keys
config = {
  environment: :production,
  debug_mode: false,
  max_connections: 100
}

# Symbols vs Strings
:hello.object_id == :hello.object_id  # true - same object
"hello".object_id == "hello".object_id # false - different objects
```

**Enumerable Methods (Ruby's Superpower):**
```ruby
numbers = [1, 2, 3, 4, 5, 6]

# Filtering
evens = numbers.select { |n| n.even? }      # [2, 4, 6]
odds = numbers.reject { |n| n.even? }       # [1, 3, 5]

# Transforming
squares = numbers.map { |n| n * n }         # [1, 4, 9, 16, 25, 36]

# Reducing
sum = numbers.reduce(0) { |total, n| total + n }  # 21
product = numbers.reduce(1) { |total, n| total * n } # 720

# Finding
first_even = numbers.find { |n| n.even? }   # 2
all_evens = numbers.find_all { |n| n.even? } # [2, 4, 6]
```

**Challenge:**
Practice working with different data structures and their methods.

**Run `bash check.sh` to test your data structure skills!**
