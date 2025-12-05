#!/bin/bash
echo "🏆 Testing Final Projects..."

# Test system info script
echo "Testing System Info Script..."
if [ -f "system_info.sh" ]; then
    chmod +x system_info.sh
    if ./system_info.sh | grep -q "SYSTEM INFORMATION"; then
        echo "✅ System Info Script working"
    else
        echo "❌ System Info Script needs work"
    fi
else
    echo "❌ System Info Script not found"
fi

# Test file organizer structure
echo "Testing File Organizer..."
if [ -f "file_organizer.sh" ]; then
    chmod +x file_organizer.sh
    if grep -q "mkdir.*images.*docs" file_organizer.sh; then
        echo "✅ File Organizer has proper structure"
    else
        echo "❌ File Organizer needs improvement"
    fi
else
    echo "❌ File Organizer not found"
fi

# Test backup script
echo "Testing Backup Script..."
if [ -f "backup_script.sh" ]; then
    chmod +x backup_script.sh
    if grep -q "tar.*czf" backup_script.sh && grep -q "TIMESTAMP" backup_script.sh; then
        echo "✅ Backup Script has core functionality"
    else
        echo "❌ Backup Script needs enhancement"
    fi
else
    echo "❌ Backup Script not found"
fi

# Overall assessment
SCRIPT_COUNT=$(ls *.sh 2>/dev/null | wc -l)
if [ $SCRIPT_COUNT -ge 2 ]; then
    echo ""
    echo "🎉 EXCELLENT WORK! You've completed the Linux Learning Game!"
    echo ""
    echo "🐧 LINUX MASTER ACHIEVED! 🏆"
    echo "================================"
    echo "You've demonstrated proficiency in:"
    echo "✅ File System Navigation"
    echo "✅ File Operations & Management"
    echo "✅ Text Processing & Manipulation"
    echo "✅ Permissions & Process Control"
    echo "✅ Shell Scripting & Automation"
    echo "✅ Real-world Project Implementation"
    echo ""
    echo "Continue practicing and exploring advanced Linux topics!"
else
    echo ""
    echo "💡 Complete at least 2 projects to finish the game."
    echo "   The templates are provided - customize and enhance them!"
fi
