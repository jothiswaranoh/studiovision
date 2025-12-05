#!/usr/bin/env ruby

def check_level2
  puts "⚙️ Checking your methods and control flow..."
  puts
  
  begin
    content = File.read('script.rb')
    
    # Check for key concepts
    has_methods = content.include?('def ')
    has_conditionals = content.include?('if ') || content.include?('elsif') || content.include?('else')
    has_loops = content.include?('each') || content.include?('while ') || content.include?('times')
    has_returns = content.include?('return') || content.match(/def.*\n.*[^#].*\nend/m)
    
    if has_methods
      puts "✅ You're creating methods - reusable code!"
    else
      puts "❌ No methods found. Use: def method_name"
    end
    
    if has_conditionals
      puts "✅ You're using conditionals - making decisions!"
    else
      puts "❌ No conditionals. Try: if condition"
    end
    
    if has_loops
      puts "✅ You're using loops - repeating tasks!"
    else
      puts "❌ No loops. Try: array.each { |item| ... }"
    end
    
    if has_returns
      puts "✅ Your methods return values - excellent!"
    else
      puts "💡 Remember: Ruby methods return the last expression automatically"
    end
    
    if has_methods && has_conditionals
      puts
      puts "🎉 ✅ Level 2 PASSED! You understand Ruby logic!"
      puts "⚙️ You can now create reusable code blocks!"
    else
      puts
      puts "💡 Practice creating methods with parameters and conditionals"
    end
    
  rescue => e
    puts "❌ Error checking your code: #{e.message}"
  end
end

check_level2
