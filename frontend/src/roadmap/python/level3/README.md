# 🎯 Level 3: Python Data Structures 🗂️

**Your Mission:** Master lists, dictionaries, tuples, and sets for organizing data.

**What You'll Learn:**
- Lists (mutable sequences)
- Dictionaries (key-value pairs)
- Tuples (immutable sequences)
- Sets (unique collections)
- List comprehensions

**Lists - Ordered, Mutable Collections:**
```python
# Creating lists
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", True, 3.14]

# List operations
fruits.append("grape")      # Add to end
fruits.insert(1, "mango")   # Insert at position
fruits.remove("banana")     # Remove item
last_fruit = fruits.pop()   # Remove and return last item

# List slicing
first_two = fruits[0:2]     # ["apple", "mango"]
last_two = fruits[-2:]      # Last two items
```

**Dictionaries - Key-Value Pairs:**
```python
# Creating dictionaries
person = {
    "name": "Alice",
    "age": 25,
    "city": "New York"
}

# Accessing values
print(person["name"])       # "Alice"
print(person.get("age"))    # 25

# Modifying dictionaries
person["email"] = "alice@example.com"  # Add new key
person["age"] = 26                     # Update value
del person["city"]                     # Remove key
```

**Tuples - Immutable Sequences:**
```python
# Creating tuples
coordinates = (10, 20)
colors = ("red", "green", "blue")

# Tuples are immutable
# coordinates[0] = 15  # This would cause an error!
```

**Sets - Unique Collections:**
```python
# Creating sets
unique_numbers = {1, 2, 3, 3, 4, 4}  # {1, 2, 3, 4}
primes = {2, 3, 5, 7}

# Set operations
union = unique_numbers | primes       # Combine sets
intersection = unique_numbers & primes # Common elements
```

**List Comprehensions (Pythonic Magic):**
```python
# Traditional way
squares = []
for x in range(10):
    squares.append(x**2)

# List comprehension (same result, more concise)
squares = [x**2 for x in range(10)]

# With condition
even_squares = [x**2 for x in range(10) if x % 2 == 0]
```

**Challenge:**
Practice working with different data structures and their methods.

**Run `bash check.sh` to test your data structure skills!**
