# TODO: Create TaskManager class

import json
from datetime import datetime
from task import Task

class TaskManager:
    def __init__(self, storage_file="tasks.json"):
        self.storage_file = storage_file
        self.tasks = self.load_tasks()
    
    def load_tasks(self):
        # Your code here - load tasks from JSON file
        pass
    
    def save_tasks(self):
        # Your code here - save tasks to JSON file
        pass
    
    def add_task(self, task_data):
        # Your code here - create and add new task
        pass
    
    def list_tasks(self, status=None):
        # Your code here - list all tasks or filtered by status
        pass
    
    def update_task_status(self, task_id, new_status):
        # Your code here
        pass
    
    def delete_task(self, task_id):
        # Your code here
        pass
    
    def get_task_statistics(self):
        # Your code here - return counts by status
        pass
