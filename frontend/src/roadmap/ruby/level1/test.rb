#!/usr/bin/env ruby

def check_level1
  puts "🔍 Checking your Ruby basics..."
  puts
  
  begin
    content = File.read('script.rb')
    
    # Check for basic Ruby constructs
    has_variables = content.include?('=') && (content.include?('puts') || content.include?('print'))
    has_strings = content.include?('"') || content.include?("'")
    has_arrays = content.include?('[') && content.include?(']')
    has_interpolation = content.include?('#{')
    
    if has_variables
      puts "✅ You're creating variables - great start!"
    else
      puts "❌ No variables found. Create some with: variable_name = value"
    end
    
    if has_strings
      puts "✅ You're working with strings - text data!"
    else
      puts "❌ No strings found. Use: \"your text\" or 'your text'"
    end
    
    if has_arrays
      puts "✅ You're using arrays - collections!"
    else
      puts "💡 Try creating arrays: fruits = [\"apple\", \"banana\"]"
    end
    
    if has_interpolation
      puts "✅ You're using string interpolation - Ruby style!"
    else
      puts "💡 Try string interpolation: \"Hello, #{name}\""
    end
    
    if has_variables && has_strings
      puts
      puts "🎉 ✅ Level 1 PASSED! You understand Ruby basics!"
      puts "💎 You're ready to write Ruby code!"
    else
      puts
      puts "💡 Try creating variables and printing them:"
      puts "   name = 'Your Name'"
      puts "   age = 25"
      puts "   puts \"Hello #{name}, age #{age}\""
    end
    
  rescue => e
    puts "❌ Error checking your code: #{e.message}"
  end
end

check_level1
