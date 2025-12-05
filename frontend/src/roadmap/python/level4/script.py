# Level 4: File Handling & Modules

# TODO: File operations

# 1. Read data from data.txt and print each line
# 2. Count how many lines are in the file
# 3. Create a new file and write some data to it
# 4. Read the file and process the data (e.g., extract ages)

# TODO: Module usage

# 5. Import and use your utils module
# 6. Use built-in modules (math, random, datetime)

# TODO: Error handling

# 7. Use try/except to handle file errors
# 8. Handle division by zero errors
# 9. Handle invalid input errors

# Example structure:
def read_and_process_file(filename):
    try:
        with open(filename, 'r') as file:
            # Your code here
            pass
    except FileNotFoundError:
        print(f"File {filename} not found!")
    except Exception as e:
        print(f"Error reading file: {e}")

def use_utils_module():
    # Your code here - import and use utils
    pass

# Test your file operations and modules
if __name__ == "__main__":
    print("File Handling Practice")
    # Call your functions here
