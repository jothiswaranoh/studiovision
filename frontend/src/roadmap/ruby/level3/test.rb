#!/usr/bin/env ruby

def check_level3
  puts "🗂️ Checking your data structures..."
  puts
  
  begin
    content = File.read('script.rb')
    
    # Check for data structure usage
    has_arrays = content.include?('[') && content.include?(']')
    has_hashes = content.include?('{') && content.include?('}')
    has_symbols = content.include?(':')
    has_enumerables = content.include?('.each') || content.include?('.map') || content.include?('.select')
    
    if has_arrays
      puts "✅ You're using arrays - ordered collections!"
    else
      puts "❌ No arrays found. Use: my_array = [1, 2, 3]"
    end
    
    if has_hashes
      puts "✅ You're using hashes - key-value pairs!"
    else
      puts "❌ No hashes. Use: my_hash = { key: 'value' }"
    end
    
    if has_symbols
      puts "✅ You're using symbols - efficient identifiers!"
    else
      puts "💡 Try symbols: :name or as hash keys: { name: 'Alice' }"
    end
    
    if has_enumerables
      puts "✅ You're using enumerable methods - Ruby power!"
    else
      puts "💡 Use enumerables: array.each { |item| ... }"
    end
    
    if has_arrays && has_hashes
      puts
      puts "🎉 ✅ Level 3 PASSED! You understand data structures!"
      puts "🗂️ You can organize data effectively!"
    else
      puts
      puts "💡 Practice creating and manipulating arrays and hashes"
    end
    
  rescue => e
    puts "❌ Error checking your code: #{e.message}"
  end
end

check_level3
