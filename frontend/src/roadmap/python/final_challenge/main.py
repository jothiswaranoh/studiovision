# TODO: Main application file

from task_manager import TaskManager

def display_menu():
    print("\n=== Task Manager ===")
    print("1. Add Task")
    print("2. List All Tasks")
    print("3. List Pending Tasks")
    print("4. Mark Task Complete")
    print("5. Delete Task")
    print("6. Show Statistics")
    print("7. Exit")

def get_user_choice():
    # Your code here - get and validate user input
    pass

def add_task_interaction(task_manager):
    # Your code here - get task details from user
    pass

def main():
    task_manager = TaskManager()
    
    while True:
        display_menu()
        choice = get_user_choice()
        
        if choice == '1':
            add_task_interaction(task_manager)
        elif choice == '2':
            task_manager.list_tasks()
        elif choice == '3':
            task_manager.list_tasks(status='pending')
        elif choice == '4':
            # Your code here - mark task complete
            pass
        elif choice == '5':
            # Your code here - delete task
            pass
        elif choice == '6':
            stats = task_manager.get_task_statistics()
            print(f"Statistics: {stats}")
        elif choice == '7':
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
