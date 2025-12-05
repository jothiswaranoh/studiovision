#!/usr/bin/env python3
import ast
import sys

def check_level1():
    print("🔍 Checking your Python basics...")
    print()
    
    try:
        with open('script.py', 'r') as file:
            content = file.read()
        
        # Parse the Python code
        tree = ast.parse(content)
        
        # Check for variables and basic structures
        has_variables = False
        has_print = False
        has_operations = False
        
        for node in ast.walk(tree):
            if isinstance(node, ast.Assign):
                has_variables = True
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == 'print':
                has_print = True
            if isinstance(node, ast.BinOp):  # +, -, *, /
                has_operations = True
        
        if has_variables:
            print("✅ You're creating variables - great start!")
        else:
            print("❌ No variables found. Create some with: variable_name = value")
        
        if has_print:
            print("✅ You're using print() - good for output!")
        else:
            print("❌ No print statements. Use: print('Your message')")
        
        if has_operations:
            print("✅ You're doing operations - math or strings!")
        else:
            print("❌ No operations found. Try: result = 5 + 3")
        
        if has_variables and has_print:
            print()
            print("🎉 ✅ Level 1 PASSED! You understand Python basics!")
            print("🐍 You're ready to write Python code!")
        else:
            print()
            print("💡 Try creating variables and printing them:")
            print("   name = 'Your Name'")
            print("   age = 25")
            print("   print(f'Hello {name}, age {age}')")
            
    except Exception as e:
        print(f"❌ Error checking your code: {e}")

if __name__ == "__main__":
    check_level1()
