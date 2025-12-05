# TODO: Main application file

require_relative 'task_manager'

def display_menu
  puts "\n=== Ruby Task Manager ==="
  puts "1. Add Task"
  puts "2. List All Tasks"
  puts "3. List Pending Tasks"
  puts "4. Mark Task Complete"
  puts "5. Delete Task"
  puts "6. Show Statistics"
  puts "7. Exit"
end

def get_user_choice
  # Your code here - get and validate user input
end

def add_task_interaction(task_manager)
  # Your code here - get task details from user
end

def main
  task_manager = TaskManager.new
  
  loop do
    display_menu
    choice = get_user_choice
    
    case choice
    when '1'
      add_task_interaction(task_manager)
    when '2'
      task_manager.list_tasks
    when '3'
      task_manager.list_tasks("pending")
    when '4'
      # Your code here - mark task complete
    when '5'
      # Your code here - delete task
    when '6'
      stats = task_manager.task_statistics
      puts "Statistics: #{stats}"
    when '7'
      puts "Goodbye!"
      break
    else
      puts "Invalid choice. Please try again."
    end
  end
end

main if __FILE__ == $0
