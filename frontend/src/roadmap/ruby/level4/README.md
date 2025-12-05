# 🎯 Level 4: File Handling & Classes 📁

**Your Mission:** Learn to work with files and organize code using classes.

**What You'll Learn:**
- Reading and writing files
- Working with different file formats
- Creating classes and objects
- Object-oriented programming basics

**File Handling:**
```ruby
# Reading files
content = File.read('data.txt')
puts content

# Reading line by line
File.readlines('data.txt').each do |line|
  puts line.chomp  # chomp removes newline characters
end

# Writing files
File.open('output.txt', 'w') do |file|
  file.puts "Hello, World!"
  file.puts "This is a new line."
end

# Appending to files
File.open('output.txt', 'a') do |file|
  file.puts "This line is appended."
end

# Checking if file exists
if File.exist?('data.txt')
  puts "File exists!"
end
```

**Working with CSV Files:**
```ruby
require 'csv'

# Reading CSV
CSV.foreach('data.csv') do |row|
  puts row.inspect  # row is an array
end

# Writing CSV
CSV.open('output.csv', 'w') do |csv|
  csv << ['Name', 'Age', 'City']
  csv << ['Alice', 25, 'New York']
  csv << ['Bob', 30, 'Los Angeles']
end
```

**Classes & Objects:**
```ruby
# Defining a class
class Dog
  # Constructor
  def initialize(name, breed, age)
    @name = name
    @breed = breed
    @age = age
  end
  
  # Instance methods
  def bark
    "#{@name} says Woof!"
  end
  
  def get_info
    "#{@name} is a #{@age}-year-old #{@breed}"
  end
  
  # Attribute readers (getters)
  attr_reader :name, :breed, :age
  
  # Attribute writers (setters)
  attr_writer :age
end

# Creating objects
dog1 = Dog.new("Buddy", "Golden Retriever", 3)
dog2 = Dog.new("Max", "German Shepherd", 5)

puts dog1.bark      # "Buddy says Woof!"
puts dog2.get_info  # "Max is a 5-year-old German Shepherd"

# Using setters
dog1.age = 4
```

**Attribute Accessors:**
```ruby
class Person
  # attr_reader - creates getter methods
  # attr_writer - creates setter methods  
  # attr_accessor - creates both getter and setter
  
  attr_accessor :name, :age
  attr_reader :id
  
  def initialize(name, age)
    @name = name
    @age = age
    @id = generate_id
  end
  
  private
  
  def generate_id
    rand(1000..9999)
  end
end

person = Person.new("Alice", 25)
puts person.name    # "Alice" (getter)
person.age = 26     # (setter)
```

**Class Methods and Variables:**
```ruby
class Calculator
  # Class variable
  @@operation_count = 0
  
  # Class method
  def self.operation_count
    @@operation_count
  end
  
  def add(a, b)
    @@operation_count += 1
    a + b
  end
  
  def multiply(a, b)
    @@operation_count += 1
    a * b
  end
end

calc = Calculator.new
calc.add(5, 3)
calc.multiply(4, 6)
puts Calculator.operation_count  # 2
```

**Error Handling:**
```ruby
begin
  number = Integer(gets.chomp)
  result = 10 / number
  puts "Result: #{result}"
rescue ArgumentError
  puts "That's not a valid number!"
rescue ZeroDivisionError
  puts "You can't divide by zero!"
rescue => e
  puts "An error occurred: #{e.message}"
ensure
  puts "This always runs."
end
```

**Challenge:**
Practice file operations and class creation.

**Run `bash check.sh` to test your file handling and OOP skills!**
