#!/usr/bin/env python3
import ast
import sys

def check_level5():
    print("🏗️ Checking your object-oriented programming...")
    print()
    
    try:
        with open('script.py', 'r') as file:
            content = file.read()
        
        tree = ast.parse(content)
        
        # Check for OOP concepts
        has_classes = False
        has_inheritance = False
        has_methods = False
        has_special_methods = False
        
        for node in ast.walk(tree):
            if isinstance(node, ast.ClassDef):
                has_classes = True
                # Check for inheritance
                if node.bases:  # Has parent classes
                    has_inheritance = True
                
                # Check for methods in the class
                for item in node.body:
                    if isinstance(item, ast.FunctionDef):
                        has_methods = True
                        # Check for special methods
                        if item.name.startswith('__') and item.name.endswith('__'):
                            has_special_methods = True
        
        if has_classes:
            print("✅ You're creating classes - OOP foundation!")
        else:
            print("❌ No classes found. Use: class ClassName:")
        
        if has_inheritance:
            print("✅ You're using inheritance - code reuse!")
        else:
            print("💡 Try inheritance: class Child(Parent):")
        
        if has_methods:
            print("✅ You're creating methods - class behavior!")
        else:
            print("❌ No methods in classes. Add: def method_name(self):")
        
        if has_special_methods:
            print("✅ You're using special methods - Python magic!")
        else:
            print("💡 Add __init__, __str__ methods to your classes")
        
        if has_classes and has_methods:
            print()
            print("🎉 ✅ Level 5 PASSED! You understand OOP in Python!")
            print("🏗️ You can build complex applications!")
        else:
            print()
            print("💡 Practice creating classes with methods and inheritance")
            
    except Exception as e:
        print(f"❌ Error checking your code: {e}")

if __name__ == "__main__":
    check_level5()
