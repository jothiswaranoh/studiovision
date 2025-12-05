#!/usr/bin/env python3
import ast
import sys

def check_level3():
    print("🗂️ Checking your data structures...")
    print()
    
    try:
        with open('script.py', 'r') as file:
            content = file.read()
        
        tree = ast.parse(content)
        
        # Check for data structure usage
        has_lists = False
        has_dicts = False
        has_comprehensions = False
        has_methods = False
        
        for node in ast.walk(tree):
            if isinstance(node, ast.List):
                has_lists = True
            if isinstance(node, ast.Dict):
                has_dicts = True
            if isinstance(node, ast.ListComp):
                has_comprehensions = True
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute):
                has_methods = True
        
        if has_lists:
            print("✅ You're using lists - ordered collections!")
        else:
            print("❌ No lists found. Use: my_list = [1, 2, 3]")
        
        if has_dicts:
            print("✅ You're using dictionaries - key-value pairs!")
        else:
            print("❌ No dictionaries. Use: my_dict = {'key': 'value'}")
        
        if has_comprehensions:
            print("✅ You're using list comprehensions - Pythonic!")
        else:
            print("💡 Try list comprehensions: [x*2 for x in range(5)]")
        
        if has_methods:
            print("✅ You're using methods - operating on data!")
        else:
            print("💡 Use methods like: my_list.append(), my_dict.get()")
        
        if has_lists and has_dicts:
            print()
            print("🎉 ✅ Level 3 PASSED! You understand data structures!")
            print("🗂️ You can organize data effectively!")
        else:
            print()
            print("💡 Practice creating and manipulating lists and dictionaries")
            
    except Exception as e:
        print(f"❌ Error checking your code: {e}")

if __name__ == "__main__":
    check_level3()
