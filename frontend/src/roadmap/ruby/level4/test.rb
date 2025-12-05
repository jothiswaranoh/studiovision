#!/usr/bin/env ruby

def check_level4
  puts "📁 Checking your file handling and classes..."
  puts
  
  begin
    content = File.read('script.rb')
    
    # Check for key concepts
    has_file_ops = content.include?('File.') || content.include?('file.')
    has_classes = content.include?('class ')
    has_initialize = content.include?('initialize')
    has_begin_rescue = content.include?('begin') || content.include?('rescue')
    
    if has_file_ops
      puts "✅ You're working with files - data persistence!"
    else
      puts "❌ No file operations. Use: File.read or File.open"
    end
    
    if has_classes
      puts "✅ You're creating classes - OOP foundation!"
    else
      puts "❌ No classes. Use: class ClassName"
    end
    
    if has_initialize
      puts "✅ You're using initialize - constructors!"
    else
      puts "💡 Add initialize method to your classes"
    end
    
    if has_begin_rescue
      puts "✅ You're handling errors - robust code!"
    else
      puts "💡 Use begin/rescue for error handling"
    end
    
    if has_file_ops && has_classes
      puts
      puts "🎉 ✅ Level 4 PASSED! You can handle files and classes!"
      puts "📁 You're writing professional Ruby code!"
    else
      puts
      puts "💡 Practice file operations and class creation"
    end
    
  rescue => e
    puts "❌ Error checking your code: #{e.message}"
  end
end

check_level4
