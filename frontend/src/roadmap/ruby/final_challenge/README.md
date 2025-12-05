# 🏆 Final Challenge: Ruby Project - Task Manager 🚀

**Your Mission:** Build a complete Task Manager application using all Ruby concepts.

**Create a console-based Task Manager with:**
- Object-oriented design
- File persistence
- User interaction
- Data validation
- Error handling

**Project Requirements:**

1. **Task Data Model**
   - Task class with title, description, due_date, priority, status
   - Use proper encapsulation with attr_accessors
   - Implement to_s method for string representation

2. **Core Functionality**
   - Add new tasks
   - View all tasks
   - Update task status
   - Delete tasks
   - Filter and search tasks

3. **File Persistence**
   - Save tasks to YAML file (Ruby's preferred format)
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
```ruby
class Task
  attr_accessor :title, :description, :due_date, :priority, :status
  
  def initialize(title, description = "", due_date = nil, priority = "medium", status = "pending")
    @title = title
    @description = description
    @due_date = due_date
    @priority = priority
    @status = status
  end
  
  def to_s
    # String representation
  end
  
  def completed?
    status == "completed"
  end
end

class TaskManager
  def initialize(storage_file = "tasks.yml")
    @storage_file = storage_file
    @tasks = load_tasks
  end
  
  def add_task(task)
    # Add task with validation
  end
  
  def save_tasks
    # Save to YAML file
  end
  
  def load_tasks
    # Load from YAML file
  end
  
  # Other methods for task management
end
```

**You've learned all the Ruby fundamentals!** 
This project will solidify your understanding and prepare you for real-world Ruby development.

**Run `bash check.sh` when your Task Manager is complete!**
