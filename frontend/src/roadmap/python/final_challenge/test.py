#!/usr/bin/env python3
import ast
import sys
import os

def check_final_challenge():
    print("🚀 Testing your Python project...")
    print()
    
    files_to_check = ['task.py', 'task_manager.py', 'main.py']
    concepts_used = {
        'classes': False,
        'inheritance': False,
        'methods': False,
        'file_ops': False,
        'error_handling': False,
        'imports': False
    }
    
    for filename in files_to_check:
        if os.path.exists(filename):
            try:
                with open(filename, 'r') as file:
                    content = file.read()
                
                tree = ast.parse(content)
                
                # Check for various concepts
                for node in ast.walk(tree):
                    if isinstance(node, ast.ClassDef):
                        concepts_used['classes'] = True
                        if node.bases:
                            concepts_used['inheritance'] = True
                    
                    if isinstance(node, ast.FunctionDef):
                        concepts_used['methods'] = True
                    
                    if isinstance(node, (ast.Import, ast.ImportFrom)):
                        concepts_used['imports'] = True
                    
                    if isinstance(node, ast.Try):
                        concepts_used['error_handling'] = True
                    
                    if isinstance(node, ast.Call):
                        if (isinstance(node.func, ast.Name) and node.func.id == 'open') or \
                           (isinstance(node.func, ast.Attribute) and node.func.attr == 'open'):
                            concepts_used['file_ops'] = True
                
                print(f"✅ {filename} - analyzed")
                
            except Exception as e:
                print(f"❌ {filename} - error: {e}")
        else:
            print(f"❌ {filename} - file not found")
    
    print()
    print("📊 Concept Usage Summary:")
    for concept, used in concepts_used.items():
        status = "✅" if used else "❌"
        print(f"   {status} {concept}")
    
    print()
    used_count = sum(concepts_used.values())
    total_count = len(concepts_used)
    
    if used_count >= 4:
        print("🎉 🏆 PYTHON MASTER ACHIEVED! 🏆")
        print("✨ You are now a Python developer!")
        print()
        print("You've successfully mastered:")
        print("• Python Syntax & Basics")
        print("• Functions & Control Flow")
        print("• Data Structures")
        print("• File Handling & Modules")
        print("• Object-Oriented Programming")
        print("• Real Project Development")
        print()
        print("What's next? Learn web frameworks like Django or Flask!")
    else:
        print(f"💡 Used {used_count}/{total_count} concepts. Keep practicing!")

if __name__ == "__main__":
    check_final_challenge()
