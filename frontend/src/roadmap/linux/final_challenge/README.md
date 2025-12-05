# 🏆 Final Challenge: Real Linux Projects 🚀

**Your Mission:** Apply all your Linux skills to complete real-world projects.

**Projects to Complete:**

1. **System Info Script** 📊
   - Display system information
   - Show disk usage, memory, and running processes
   - Save report to a file with timestamp

2. **File Organizer** 🗂️
   - Organize files by extension
   - Create directories for different file types
   - Move files to appropriate directories

3. **Backup Script** 💾
   - Create compressed backups of important directories
   - Add timestamp to backup files
   - Include progress indicators

4. **User Management Tool** 👥
   - List all system users
   - Show user login information
   - Display home directory sizes

**Example Project Structure:**
```bash
#!/bin/bash
# System Info Script
echo "=== System Information ==="
echo "Date: $(date)"
echo "User: $(whoami)"
echo "Uptime: $(uptime)"
echo "Disk Usage:"
df -h | grep -v tmpfs
```

**Advanced Features to Implement:**
- Command-line arguments
- Error handling and logging
- Progress indicators
- Configuration files
- Email notifications (optional)

**Skills Demonstrated:**
✅ File System Navigation  
✅ File Operations  
✅ Text Processing  
✅ Permissions Management  
✅ Process Control  
✅ Shell Scripting  

**Run `bash check.sh` when your projects are complete!**
