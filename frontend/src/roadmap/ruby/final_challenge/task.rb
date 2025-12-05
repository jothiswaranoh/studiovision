# TODO: Create Task class

class Task
  # Your code here
  
  def initialize(title, description = "", due_date = nil, priority = "medium", status = "pending")
    # Your code here
  end
  
  def to_s
    # Your code here - return string representation
  end
  
  def completed?
    # Your code here
  end
  
  def mark_complete!
    # Your code here
  end
  
  def overdue?
    # Your code here - check if due date has passed
  end
end
