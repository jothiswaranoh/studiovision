# 🎯 Level 5: Advanced Ruby & Metaprogramming 🔮

**Your Mission:** Master advanced Ruby concepts and metaprogramming techniques.

**What You'll Learn:**
- Modules and mixins
- Inheritance and polymorphism
- Blocks, procs, and lambdas
- Metaprogramming basics
- Method missing and dynamic methods

**Modules and Mixins:**
```ruby
# Creating a module
module Speakable
  def speak
    "Hello, I'm #{@name}"
  end
  
  def shout
    speak.upcase + "!"
  end
end

module Walkable
  def walk
    "#{@name} is walking"
  end
end

# Using modules in classes
class Person
  include Speakable
  include Walkable
  
  def initialize(name)
    @name = name
  end
end

class Robot
  include Speakable
  
  def initialize(name)
    @name = name
  end
end

person = Person.new("Alice")
puts person.speak  # "Hello, I'm Alice"
puts person.walk   # "Alice is walking"

robot = Robot.new("R2D2")
puts robot.speak   # "Hello, I'm R2D2"
```

**Inheritance:**
```ruby
class Animal
  attr_reader :name
  
  def initialize(name)
    @name = name
  end
  
  def speak
    "Some generic animal sound"
  end
end

class Dog < Animal
  def speak
    "Woof!"
  end
  
  def fetch
    "#{@name} is fetching the ball"
  end
end

class Cat < Animal
  def speak
    "Meow!"
  end
  
  def purr
    "Purrrrr..."
  end
end

dog = Dog.new("Buddy")
cat = Cat.new("Whiskers")

puts dog.speak  # "Woof!"
puts cat.speak  # "Meow!"
```

**Blocks, Procs, and Lambdas:**
```ruby
# Blocks (anonymous code blocks)
3.times { puts "Hello!" }

[1, 2, 3].each do |number|
  puts number * 2
end

# Procs (reusable blocks)
double = Proc.new { |x| x * 2 }
puts [1, 2, 3].map(&double)  # [2, 4, 6]

# Lambdas (similar to procs but with argument checking)
square = lambda { |x| x * x }
puts square.call(5)  # 25

# Differences
proc = Proc.new { |x, y| puts "x: #{x}, y: #{y}" }
lambda = lambda { |x, y| puts "x: #{x}, y: #{y}" }

proc.call(1)        # "x: 1, y: " (y is nil)
# lambda.call(1)    # Error - wrong number of arguments
```

**Metaprogramming:**
```ruby
# Dynamic method creation
class DynamicClass
  # Create methods dynamically
  ['add', 'subtract', 'multiply', 'divide'].each do |operation|
    define_method(operation) do |a, b|
      case operation
      when 'add' then a + b
      when 'subtract' then a - b
      when 'multiply' then a * b
      when 'divide' then a / b
      end
    end
  end
end

calc = DynamicClass.new
puts calc.add(5, 3)       # 8
puts calc.multiply(4, 6)  # 24

# Method missing
class SmartHash
  def initialize
    @data = {}
  end
  
  def method_missing(method_name, *args)
    if method_name.to_s.end_with?('=')
      key = method_name.to_s.chop.to_sym
      @data[key] = args.first
    else
      @data[method_name]
    end
  end
  
  def respond_to_missing?(method_name, include_private = false)
    true
  end
end

hash = SmartHash.new
hash.name = "Alice"    # Calls method_missing
puts hash.name         # "Alice" - Calls method_missing
```

**Advanced Enumerable:**
```ruby
people = [
  { name: "Alice", age: 25, city: "New York" },
  { name: "Bob", age: 30, city: "Los Angeles" },
  { name: "Carol", age: 28, city: "New York" },
  { name: "David", age: 35, city: "Chicago" }
]

# Group by
by_city = people.group_by { |person| person[:city] }
# {
#   "New York" => [{...}, {...}],
#   "Los Angeles" => [{...}],
#   "Chicago" => [{...}]
# }

# Sort by
by_age = people.sort_by { |person| person[:age] }

# Chaining enumerables
result = people
  .select { |p| p[:age] > 25 }
  .map { |p| p[:name] }
  .sort
# ["Bob", "Carol", "David"]
```

**Challenge:**
Practice advanced Ruby patterns and metaprogramming techniques.

**Run `bash check.sh` to test your advanced Ruby skills!**
