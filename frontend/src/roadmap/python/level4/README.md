# 🎯 Level 4: File Handling & Modules 📁

**Your Mission:** Learn to work with files and organize code into modules.

**What You'll Learn:**
- Reading and writing files
- Working with different file formats
- Creating and importing modules
- Error handling with try/except

**File Handling:**
```python
# Reading files
with open('data.txt', 'r') as file:
    content = file.read()
    print(content)

# Writing files
with open('output.txt', 'w') as file:
    file.write("Hello, World!\n")
    file.write("This is a new line.")

# Reading line by line
with open('data.txt', 'r') as file:
    for line in file:
        print(line.strip())  # strip() removes newline characters
```

**Working with CSV Files:**
```python
import csv

# Reading CSV
with open('data.csv', 'r') as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)

# Writing CSV
with open('output.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['Name', 'Age', 'City'])
    writer.writerow(['Alice', 25, 'New York'])
```

**Modules - Organizing Code:**
```python
# math_operations.py (module file)
def add(a, b):
    return a + b

def multiply(a, b):
    return a * b

PI = 3.14159

# main.py (using the module)
import math_operations

result = math_operations.add(5, 3)
print(result)  # 8

# Alternative imports
from math_operations import multiply, PI
print(multiply(4, 5))  # 20
print(PI)              # 3.14159
```

**Error Handling:**
```python
try:
    number = int(input("Enter a number: "))
    result = 10 / number
    print(f"Result: {result}")
except ValueError:
    print("That's not a valid number!")
except ZeroDivisionError:
    print("You can't divide by zero!")
except Exception as e:
    print(f"An error occurred: {e}")
else:
    print("Division successful!")
finally:
    print("This always runs.")
```

**Built-in Modules:**
```python
import math
import random
import datetime
import os

# Math operations
print(math.sqrt(16))        # 4.0
print(math.pi)              # 3.141592653589793

# Random numbers
print(random.randint(1, 10))  # Random integer between 1-10
print(random.choice(['a', 'b', 'c']))  # Random choice

# Date and time
now = datetime.datetime.now()
print(now.strftime("%Y-%m-%d %H:%M:%S"))

# File system
print(os.getcwd())  # Current working directory
```

**Challenge:**
Practice file operations and module creation.

**Run `bash check.sh` to test your file handling skills!**
