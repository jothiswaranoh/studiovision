#!/bin/bash
echo "📄 Testing File Operations..."

# Setup test environment
mkdir -p test_area
cd test_area

# Test file creation
touch document.txt notes.md data.csv
if [ -f "document.txt" ] && [ -f "notes.md" ] && [ -f "data.csv" ]; then
    echo "✅ File creation successful"
else
    echo "❌ File creation failed"
fi

# Test copying
cp document.txt document_backup.txt
if [ -f "document_backup.txt" ]; then
    echo "✅ File copying successful"
else
    echo "❌ File copying failed"
fi

# Test moving/renaming
mv notes.md important_notes.md
if [ -f "important_notes.md" ] && [ ! -f "notes.md" ]; then
    echo "✅ File renaming successful"
else
    echo "❌ File renaming failed"
fi

# Test directory creation
mkdir -p projects/{website,scripts,docs}
if [ -d "projects/website" ] && [ -d "projects/scripts" ] && [ -d "projects/docs" ]; then
    echo "✅ Directory structure creation successful"
else
    echo "❌ Directory creation failed"
fi

# Test moving files between directories
mv data.csv projects/docs/
if [ -f "projects/docs/data.csv" ] && [ ! -f "data.csv" ]; then
    echo "✅ File moving successful"
else
    echo "❌ File moving failed"
fi

# Cleanup
cd ..
rm -rf test_area

echo ""
echo "🎉 Level 2 COMPLETED! You can manage files like a pro!"
echo "📊 You now understand file operations in Linux!"
