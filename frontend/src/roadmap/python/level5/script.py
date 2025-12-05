# Level 5: Object-Oriented Programming

# TODO: Create basic classes

# 1. Create a Person class with name, age, and email
class Person:
    def __init__(self, name, age, email):
        pass
    
    def __str__(self):
        pass
    
    def have_birthday(self):
        pass

# 2. Create a Student class that inherits from Person
class Student(Person):
    def __init__(self, name, age, email, student_id, major):
        pass
    
    def add_grade(self, course, grade):
        pass
    
    def get_gpa(self):
        pass

# TODO: Create more complex classes

# 3. Create a BankAccount class with encapsulation
class BankAccount:
    def __init__(self, account_number, owner, balance=0):
        pass
    
    def deposit(self, amount):
        pass
    
    def withdraw(self, amount):
        pass
    
    def get_balance(self):
        pass
    
    def __str__(self):
        pass

# 4. Create a Book class with special methods
class Book:
    def __init__(self, title, author, isbn, pages):
        pass
    
    def __str__(self):
        pass
    
    def __len__(self):
        pass
    
    def __eq__(self, other):
        pass

# TODO: Practice polymorphism

# 5. Create different shape classes with area methods
class Shape:
    def area(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        pass
    
    def area(self):
        pass

class Circle(Shape):
    def __init__(self, radius):
        pass
    
    def area(self):
        pass

# Test your classes
if __name__ == "__main__":
    print("OOP Practice")
    # Create objects and test methods here
