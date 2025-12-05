# Level 4: File Handling & Classes

# TODO: File operations

# 1. Read data from data.txt and print each line
# 2. Count how many lines are in the file
# 3. Create a new file and write some data to it
# 4. Read the file and process the data (e.g., extract ages)

# TODO: Class creation

# 5. Create a Person class with attributes and methods
class Person
  # Your code here
end

# 6. Create a Book class
class Book
  # Your code here
end

# 7. Create a Library class that manages books
class Library
  # Your code here
end

# TODO: Error handling

# 8. Use begin/rescue to handle file errors
# 9. Handle division by zero errors
# 10. Handle invalid input errors

# Example structure:
def read_and_process_file(filename)
  begin
    # Your code here
  rescue Errno::ENOENT
    puts "File #{filename} not found!"
  rescue => e
    puts "Error reading file: #{e.message}"
  end
end

def use_utils_module
  # Your code here - use MathUtils and StringUtils
end

# Test your file operations and classes
if __FILE__ == $0
  puts "File Handling and Classes Practice"
  # Call your functions here
end
