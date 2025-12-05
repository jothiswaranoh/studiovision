# Level 5: Advanced Ruby & Metaprogramming

# TODO: Create modules and mixins

# 1. Create a Printable module
module Printable
  # Your code here
end

# 2. Create a Searchable module
module Searchable
  # Your code here
end

# 3. Create classes that use these modules
class Document
  # Your code here
end

# TODO: Practice inheritance

# 4. Create a Vehicle class and subclasses
class Vehicle
  # Your code here
end

class Car < Vehicle
  # Your code here
end

class Bicycle < Vehicle
  # Your code here
end

# TODO: Practice with blocks, procs, and lambdas

# 5. Create methods that accept blocks
def with_timing
  # Your code here
end

# 6. Create and use procs
double = # Your code here

# 7. Create and use lambdas
square = # Your code here

# TODO: Metaprogramming

# 8. Create a class that uses define_method
class DynamicCalculator
  # Your code here
end

# 9. Create a class that uses method_missing
class FlexibleObject
  # Your code here
end

# TODO: Advanced enumerable operations

# 10. Practice complex data transformations
data = [
  { product: "apple", category: "fruit", price: 1.5, quantity: 10 },
  { product: "banana", category: "fruit", price: 0.5, quantity: 20 },
  { product: "carrot", category: "vegetable", price: 0.8, quantity: 15 },
  { product: "broccoli", category: "vegetable", price: 1.2, quantity: 8 }
]

# Your code here - practice group_by, sort_by, reduce, etc.

# Test your advanced Ruby skills
if __FILE__ == $0
  puts "Advanced Ruby Practice"
  # Test your code here
end
