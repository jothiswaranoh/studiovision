# 🎯 Level 3: Text Processing & Manipulation 📝

**Your Mission:** Learn powerful text processing commands for data manipulation.

**What You'll Learn:**
- Searching in files
- Text filtering and transformation
- Pattern matching with grep
- Text stream editing

**Essential Commands:**
- `grep` - Search text using patterns
- `sed` - Stream editor for text transformation
- `awk` - Pattern scanning and processing language
- `cut` - Remove sections from lines
- `sort` - Sort lines of text
- `uniq` - Report or omit repeated lines

**Common Text Processing Tasks:**
```bash
# Searching
grep "pattern" file.txt          # Search for pattern
grep -r "pattern" directory/     # Recursive search
grep -i "pattern" file.txt       # Case-insensitive search

# Text transformation
sed 's/old/new/g' file.txt       # Replace text
awk '{print $1}' file.txt        # Print first column
cut -d',' -f1 file.csv          # Cut first field from CSV

# Sorting and filtering
sort file.txt                   # Sort lines
sort -r file.txt                # Reverse sort
uniq file.txt                   # Remove duplicates
```

**Challenge Tasks:**
1. Search for specific text in files
2. Extract specific columns from data
3. Replace text in files
4. Sort and filter data
5. Combine multiple commands with pipes

**Power of Pipes:**
```bash
# Chain commands together
cat file.txt | grep "error" | sort | uniq
ps aux | grep "chrome" | awk '{print $2}'
```

**Run `bash check.sh` to test your text processing skills!**
