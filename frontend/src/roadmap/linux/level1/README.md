# 🎯 Level 1: Linux Basics & Navigation 🗂️

**Your Mission:** Learn fundamental Linux commands and file system navigation.

**What You'll Learn:**
- Basic Linux commands
- File system navigation
- Understanding paths (absolute vs relative)
- Checking your current location

**Essential Commands:**
- `pwd` - Print Working Directory (where am I?)
- `ls` - List directory contents (what's here?)
- `cd` - Change Directory (move around)
- `mkdir` - Make Directory (create folders)
- `touch` - Create empty files

**File System Structure:**
```
/               - Root directory
├── home/       - User directories
├── etc/        - System configuration
├── var/        - Variable files
└── bin/        - Essential binaries
```

**Challenge Tasks:**
1. Find out where you are in the file system
2. List what's in your current directory
3. Create a new directory called "practice"
4. Navigate into the practice directory
5. Create a file called "hello.txt"

**Example Commands:**
```bash
pwd                    # See current location
ls                     # List files
mkdir practice         # Create directory
cd practice            # Enter directory
touch hello.txt        # Create file
ls                     # Verify file creation
```

**💡 Tips:**
- Use `cd ~` to go to your home directory
- Use `cd ..` to go up one level
- Use `ls -l` for detailed listing
- Use `tab` key for auto-completion

**Run `bash check.sh` to test your Linux skills!**
