# 🎯 Level 5: Object-Oriented Programming 🏗️

**Your Mission:** Master classes and objects for building complex applications.

**What You'll Learn:**
- Classes and objects
- Inheritance and polymorphism
- Encapsulation and abstraction
- Special methods (__init__, __str__, etc.)

**Classes and Objects:**
```python
# Defining a class
class Dog:
    # Constructor method
    def __init__(self, name, age, breed):
        self.name = name
        self.age = age
        self.breed = breed
    
    # Instance method
    def bark(self):
        return f"{self.name} says Woof!"
    
    def get_info(self):
        return f"{self.name} is a {self.age}-year-old {self.breed}"

# Creating objects (instances)
dog1 = Dog("Buddy", 3, "Golden Retriever")
dog2 = Dog("Max", 5, "German Shepherd")

print(dog1.bark())      # "Buddy says Woof!"
print(dog2.get_info())  # "Max is a 5-year-old German Shepherd"
```

**Inheritance:**
```python
# Parent class
class Animal:
    def __init__(self, name, species):
        self.name = name
        self.species = species
    
    def make_sound(self):
        return "Some generic sound"
    
    def get_info(self):
        return f"{self.name} is a {self.species}"

# Child class
class Cat(Animal):
    def __init__(self, name, breed, indoor=True):
        super().__init__(name, "Cat")
        self.breed = breed
        self.indoor = indoor
    
    # Overriding parent method
    def make_sound(self):
        return "Meow!"
    
    # New method specific to Cat
    def purr(self):
        return "Purrrrr..."

# Using inheritance
cat = Cat("Whiskers", "Siamese")
print(cat.make_sound())  # "Meow!"
print(cat.get_info())    # "Whiskers is a Cat" (inherited)
```

**Special Methods:**
```python
class Book:
    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages
    
    # String representation
    def __str__(self):
        return f"'{self.title}' by {self.author}"
    
    # Length of book (pages)
    def __len__(self):
        return self.pages
    
    # Equality comparison
    def __eq__(self, other):
        return self.title == other.title and self.author == other.author

book1 = Book("Python Basics", "John Doe", 300)
book2 = Book("Python Basics", "John Doe", 350)

print(book1)        # Uses __str__: 'Python Basics' by John Doe
print(len(book1))   # Uses __len__: 300
print(book1 == book2)  # Uses __eq__: True (same title and author)
```

**Properties and Encapsulation:**
```python
class BankAccount:
    def __init__(self, account_holder, balance=0):
        self.account_holder = account_holder
        self._balance = balance  # Protected attribute
        self._transaction_history = []
    
    # Property getter
    @property
    def balance(self):
        return self._balance
    
    # Methods to control access
    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            self._transaction_history.append(f"Deposited: ${amount}")
            return True
        return False
    
    def withdraw(self, amount):
        if 0 < amount <= self._balance:
            self._balance -= amount
            self._transaction_history.append(f"Withdrew: ${amount}")
            return True
        return False
    
    def get_transaction_history(self):
        return self._transaction_history.copy()  # Return a copy

# Using the class
account = BankAccount("Alice", 1000)
account.deposit(500)
account.withdraw(200)
print(account.balance)  # 1300 (using property)
```

**Challenge:**
Create classes that model real-world entities and relationships.

**Run `bash check.sh` to test your OOP skills!**
