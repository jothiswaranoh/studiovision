# 🎯 Level 2: File Operations & Management 📄

**Your Mission:** Learn to create, copy, move, and manage files and directories.

**What You'll Learn:**
- Creating files and directories
- Copying and moving files
- Removing files and directories
- Viewing file contents

**Essential Commands:**
- `cp` - Copy files/directories
- `mv` - Move/rename files/directories
- `rm` - Remove files
- `rmdir` - Remove empty directories
- `cat` - View file contents
- `nano`/`vim` - Text editors

**File Operations:**
```bash
# Copying
cp file1.txt file2.txt          # Copy file
cp -r dir1 dir2                 # Copy directory recursively

# Moving/Renaming
mv old.txt new.txt              # Rename file
mv file.txt /path/to/destination # Move file

# Removing
rm file.txt                     # Remove file
rm -r directory/                # Remove directory recursively

# Viewing
cat file.txt                    # Show entire file
head file.txt                   # Show first 10 lines
tail file.txt                   # Show last 10 lines
```

**Challenge Tasks:**
1. Create multiple files with different extensions
2. Copy a file to create a backup
3. Rename a file
4. Create a directory structure
5. Remove files and directories safely

**Safety First:**
- Always double-check paths before using `rm`
- Use `rm -i` for interactive removal (asks for confirmation)
- Be careful with `rm -rf` (force recursive removal)

**Run `bash check.sh` to test your file management skills!**
