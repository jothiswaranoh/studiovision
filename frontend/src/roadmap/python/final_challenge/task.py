# TODO: Create Task class

class Task:
    def __init__(self, title, description="", due_date=None, priority="medium", status="pending"):
        # Your code here
        pass
    
    def __str__(self):
        # Your code here - return string representation
        pass
    
    def to_dict(self):
        # Convert task to dictionary for JSON serialization
        pass
    
    @classmethod
    def from_dict(cls, data):
        # Create Task instance from dictionary
        pass
    
    def mark_complete(self):
        # Your code here
        pass
    
    def update_priority(self, new_priority):
        # Your code here
        pass
