#!/usr/bin/env ruby

def check_level5
  puts "🔮 Checking your advanced Ruby skills..."
  puts
  
  begin
    content = File.read('script.rb')
    
    # Check for advanced concepts
    has_modules = content.include?('module ')
    has_inheritance = content.include?(' < ')
    has_blocks = content.include?(' do |') || content.include?(' { |')
    has_metaprogramming = content.include?('define_method') || content.include?('method_missing')
    
    if has_modules
      puts "✅ You're using modules - code organization!"
    else
      puts "❌ No modules found. Use: module ModuleName"
    end
    
    if has_inheritance
      puts "✅ You're using inheritance - OOP relationships!"
    else
      puts "💡 Try inheritance: class Child < Parent"
    end
    
    if has_blocks
      puts "✅ You're using blocks - Ruby's power!"
    else
      puts "❌ No blocks. Try: array.each { |item| ... }"
    end
    
    if has_metaprogramming
      puts "✅ You're using metaprogramming - advanced techniques!"
    else
      puts "💡 Explore metaprogramming with define_method"
    end
    
    if has_modules && has_inheritance
      puts
      puts "🎉 ✅ Level 5 PASSED! You understand advanced Ruby!"
      puts "🔮 You're becoming a Ruby expert!"
    else
      puts
      puts "💡 Practice modules, inheritance, and blocks"
    end
    
  rescue => e
    puts "❌ Error checking your code: #{e.message}"
  end
end

check_level5
