# 🎯 Level 4: Permissions & Process Management 🔒

**Your Mission:** Learn to manage file permissions and system processes.

**What You'll Learn:**
- Linux file permissions system
- User and group management
- Process monitoring and control
- System resource monitoring

**File Permissions:**
```
-rwxr-xr--  1 user group  2048 Jan 15 10:30 script.sh
│└─┴─┴─└─┴─┴─└─┴─┴─
│ │  │  │   │    │        │
│ │  │  │   │    │        └─ File Name
│ │  │  │   │    └─ Date Modified
│ │  │  │   └─ Size
│ │  │  └─ Group
│ │  └─ User
│ └─ Permissions (rwxr-xr--)
└─ File Type (- = file, d = directory)
```

**Permission Codes:**
- `r` = read (4)
- `w` = write (2) 
- `x` = execute (1)
- `-` = no permission

**Essential Commands:**
```bash
# Permissions
chmod 755 script.sh            # Change permissions
chown user:group file.txt      # Change owner
ls -l                          # View permissions

# Processes
ps aux                         # View all processes
top                            # Interactive process viewer
kill 1234                      # Kill process by PID
killall process_name           # Kill processes by name

# System info
whoami                         # Current user
id                             # User identity
free -h                        # Memory usage
df -h                          # Disk space
```

**Challenge Tasks:**
1. Understand and modify file permissions
2. Create and manage users/groups
3. Monitor system processes
4. Manage running applications
5. Check system resources

**Run `bash check.sh` to test your system management skills!**
