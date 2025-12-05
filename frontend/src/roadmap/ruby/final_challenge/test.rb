#!/usr/bin/env ruby

def check_final_challenge
  puts "🚀 Testing your Ruby project..."
  puts
  
  files_to_check = ['task.rb', 'task_manager.rb', 'main.rb']
  concepts_used = {
    'classes' => false,
    'inheritance' => false,
    'methods' => false,
    'file_ops' => false,
    'error_handling' => false,
    'modules' => false
  }
  
  files_to_check.each do |filename|
    if File.exist?(filename)
      begin
        content = File.read(filename)
        
        # Check for various concepts
        concepts_used['classes'] ||= content.include?('class ')
        concepts_used['inheritance'] ||= content.include?(' < ')
        concepts_used['methods'] ||= content.include?('def ')
        concepts_used['file_ops'] ||= content.include?('File.') || content.include?('YAML')
        concepts_used['error_handling'] ||= content.include?('rescue')
        concepts_used['modules'] ||= content.include?('require')
        
        puts "✅ #{filename} - analyzed"
        
      rescue => e
        puts "❌ #{filename} - error: #{e.message}"
      end
    else
      puts "❌ #{filename} - file not found"
    end
  end
  
  puts
  puts "📊 Concept Usage Summary:"
  concepts_used.each do |concept, used|
    status = used ? "✅" : "❌"
    puts "   #{status} #{concept}"
  end
  
  puts
  used_count = concepts_used.values.count(true)
  total_count = concepts_used.size
  
  if used_count >= 4
    puts "🎉 🏆 RUBY MASTER ACHIEVED! 🏆"
    puts "✨ You are now a Ruby developer!"
    puts
    puts "You've successfully mastered:"
    puts "• Ruby Syntax & Basics"
    puts "• Methods & Control Flow"
    puts "• Data Structures (Arrays, Hashes)"
    puts "• File Handling & Classes"
    puts "• Advanced Ruby & Metaprogramming"
    puts "• Real Project Development"
    puts
    puts "What's next? Learn web frameworks like Ruby on Rails!"
  else
    puts "💡 Used #{used_count}/#{total_count} concepts. Keep practicing!"
  end
end

check_final_challenge
