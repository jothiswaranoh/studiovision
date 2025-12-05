#!/bin/bash
echo "🚀 Final Project Templates"

# Project 1: System Info Script Template
cat > system_info.sh <<'SCRIPT'
#!/bin/bash
# System Information Script
echo "=== SYSTEM INFORMATION ==="
echo "Date: $(date)"
echo "User: $(whoami)"
echo "Hostname: $(hostname)"
echo ""
echo "=== UPTIME ==="
uptime
echo ""
echo "=== DISK USAGE ==="
df -h | grep -v tmpfs
echo ""
echo "=== MEMORY USAGE ==="
free -h
echo ""
echo "=== RUNNING PROCESSES (top 5 by CPU) ==="
ps aux --sort=-%cpu | head -6
SCRIPT

# Project 2: File Organizer Template
cat > file_organizer.sh <<'SCRIPT'
#!/bin/bash
# File Organizer Script
ORGANIZE_DIR="./to_organize"
echo "Organizing files in: $ORGANIZE_DIR"

# Create directories if they don't exist
mkdir -p "$ORGANIZE_DIR"/{images,docs,scripts,archives,other}

# Move files by extension
mv "$ORGANIZE_DIR"/*.jpg "$ORGANIZE_DIR"/*.png "$ORGANIZE_DIR"/*.gif "$ORGANIZE_DIR"/images/ 2>/dev/null
mv "$ORGANIZE_DIR"/*.txt "$ORGANIZE_DIR"/*.pdf "$ORGANIZE_DIR"/*.doc "$ORGANIZE_DIR"/docs/ 2>/dev/null
mv "$ORGANIZE_DIR"/*.sh "$ORGANIZE_DIR"/*.py "$ORGANIZE_DIR"/scripts/ 2>/dev/null
mv "$ORGANIZE_DIR"/*.zip "$ORGANIZE_DIR"/*.tar "$ORGANIZE_DIR"/archives/ 2>/dev/null

# Move remaining files to other
mv "$ORGANIZE_DIR"/* "$ORGANIZE_DIR"/other/ 2>/dev/null

echo "Organization complete!"
echo "Files organized by type."
SCRIPT

# Project 3: Backup Script Template
cat > backup_script.sh <<'SCRIPT'
#!/bin/bash
# Backup Script
BACKUP_SRC="$1"
BACKUP_DEST="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

if [ -z "$BACKUP_SRC" ]; then
    echo "Usage: $0 <directory_to_backup>"
    exit 1
fi

if [ ! -d "$BACKUP_SRC" ]; then
    echo "Error: Directory $BACKUP_SRC does not exist"
    exit 1
fi

mkdir -p "$BACKUP_DEST"
BACKUP_FILE="$BACKUP_DEST/backup_$(basename $BACKUP_SRC)_$TIMESTAMP.tar.gz"

echo "Starting backup of $BACKUP_SRC..."
tar -czf "$BACKUP_FILE" "$BACKUP_SRC" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "Backup completed: $BACKUP_FILE"
    echo "Size: $(du -h "$BACKUP_FILE" | cut -f1)"
else
    echo "Backup failed!"
    exit 1
fi
SCRIPT

chmod +x system_info.sh file_organizer.sh backup_script.sh
echo "Project templates created! Modify and enhance them."
