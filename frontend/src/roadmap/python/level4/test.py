#!/usr/bin/env python3
import ast
import sys
import os

def check_level4():
    print("📁 Checking your file handling and modules...")
    print()
    
    try:
        with open('script.py', 'r') as file:
            content = file.read()
        
        tree = ast.parse(content)
        
        # Check for key concepts
        has_file_ops = False
        has_imports = False
        has_try_except = False
        has_with_statement = False
        
        for node in ast.walk(tree):
            if isinstance(node, ast.Import) or isinstance(node, ast.ImportFrom):
                has_imports = True
            if isinstance(node, ast.Try):
                has_try_except = True
            if isinstance(node, ast.With):
                has_with_statement = True
            if isinstance(node, ast.Call):
                if (isinstance(node.func, ast.Name) and node.func.id == 'open') or \
                   (isinstance(node.func, ast.Attribute) and node.func.attr == 'open'):
                    has_file_ops = True
        
        if has_file_ops:
            print("✅ You're working with files - data persistence!")
        else:
            print("❌ No file operations. Use: with open('file.txt', 'r') as f:")
        
        if has_imports:
            print("✅ You're using imports - code organization!")
        else:
            print("❌ No imports. Try: import math or from utils import function")
        
        if has_try_except:
            print("✅ You're handling errors - robust code!")
        else:
            print("💡 Use try/except for error handling")
        
        if has_with_statement:
            print("✅ You're using with statements - proper resource management!")
        else:
            print("💡 Use 'with open()' for automatic file closing")
        
        if has_file_ops and has_imports:
            print()
            print("🎉 ✅ Level 4 PASSED! You can handle files and modules!")
            print("📁 You're writing professional Python code!")
        else:
            print()
            print("💡 Practice file operations and module imports")
            
    except Exception as e:
        print(f"❌ Error checking your code: {e}")

if __name__ == "__main__":
    check_level4()
