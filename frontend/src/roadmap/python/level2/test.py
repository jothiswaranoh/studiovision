#!/usr/bin/env python3
import ast
import sys

def check_level2():
    print("⚙️ Checking your functions and control flow...")
    print()
    
    try:
        with open('script.py', 'r') as file:
            content = file.read()
        
        tree = ast.parse(content)
        
        # Check for key concepts
        has_functions = False
        has_conditionals = False
        has_loops = False
        has_returns = False
        
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                has_functions = True
                # Check if function has return statement
                for subnode in ast.walk(node):
                    if isinstance(subnode, ast.Return):
                        has_returns = True
            if isinstance(node, ast.If):
                has_conditionals = True
            if isinstance(node, (ast.For, ast.While)):
                has_loops = True
        
        if has_functions:
            print("✅ You're creating functions - reusable code!")
        else:
            print("❌ No functions found. Use: def function_name():")
        
        if has_conditionals:
            print("✅ You're using if statements - making decisions!")
        else:
            print("❌ No conditionals. Try: if condition:")
        
        if has_loops:
            print("✅ You're using loops - repeating tasks!")
        else:
            print("❌ No loops. Try: for item in list:")
        
        if has_returns:
            print("✅ Your functions return values - excellent!")
        else:
            print("💡 Use return statements in functions to give back results")
        
        if has_functions and has_conditionals:
            print()
            print("🎉 ✅ Level 2 PASSED! You understand Python logic!")
            print("⚙️ You can now create reusable code blocks!")
        else:
            print()
            print("💡 Practice creating functions with parameters and return values")
            
    except Exception as e:
        print(f"❌ Error checking your code: {e}")

if __name__ == "__main__":
    check_level2()
