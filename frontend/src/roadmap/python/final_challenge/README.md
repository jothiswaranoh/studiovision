# 🏆 Final Challenge: Python Project - Task Manager 🚀

**Your Mission:** Build a complete Task Manager application using all Python concepts.

**Create a console-based Task Manager with:**
- Object-oriented design
- File persistence
- User interaction
- Data validation
- Error handling

**Project Requirements:**

1. **Task Data Model**
   - Task class with title, description, due_date, priority, status
   - Use proper encapsulation
   - Implement string representation

2. **Core Functionality**
   - Add new tasks
   - View all tasks
   - Update task status
   - Delete tasks
   - Filter and search tasks

3. **File Persistence**
   - Save tasks to JSON file
   - Load tasks on startup
   - Handle file errors gracefully

4. **User Interface**
   - Console menu system
   - Input validation
   - Clear user feedback

**Advanced Features:**
- Task categories/tags
- Due date reminders
- Priority-based sorting
- Statistics (completed vs pending)
- Search by multiple criteria

**Example Structure:**
```python
class Task:
    def __init__(self, title, description="", due_date=None, priority="medium", status="pending"):
        self.title = title
        self.description = description
        self.due_date = due_date
        self.priority = priority
        self.status = status
    
    def to_dict(self):
        # Convert to dictionary for JSON serialization
        pass
    
    @classmethod
    def from_dict(cls, data):
        # Create Task from dictionary
        pass

class TaskManager:
    def __init__(self, storage_file="tasks.json"):
        self.storage_file = storage_file
        self.tasks = self.load_tasks()
    
    def add_task(self, task):
        # Add task with validation
        pass
    
    def save_tasks(self):
        # Save to JSON file
        pass
    
    def load_tasks(self):
        # Load from JSON file
        pass
    
    # Other methods for task management
```

**You've learned all the Python fundamentals!** 
This project will solidify your understanding and prepare you for real-world Python development.

**Run `bash check.sh` when your Task Manager is complete!**
