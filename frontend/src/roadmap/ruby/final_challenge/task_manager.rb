# TODO: Create TaskManager class

require 'yaml'

class TaskManager
  # Your code here
  
  def initialize(storage_file = "tasks.yml")
    # Your code here
  end
  
  def load_tasks
    # Your code here - load tasks from YAML file
  end
  
  def save_tasks
    # Your code here - save tasks to YAML file
  end
  
  def add_task(task_data)
    # Your code here - create and add new task
  end
  
  def list_tasks(status = nil)
    # Your code here - list all tasks or filtered by status
  end
  
  def update_task_status(task_id, new_status)
    # Your code here
  end
  
  def delete_task(task_id)
    # Your code here
  end
  
  def task_statistics
    # Your code here - return counts by status
  end
end
