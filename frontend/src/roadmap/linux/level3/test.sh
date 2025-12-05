#!/bin/bash
echo "📝 Testing Text Processing Skills..."

# Create test files
cat > test_employees.txt <<'DATA'
John Doe,Engineering,50000
Jane Smith,Marketing,60000
Bob Johnson,Engineering,55000
Alice Brown,Sales,48000
Charlie Wilson,Engineering,52000
DATA

cat > test_log.txt <<'DATA'
2024-01-15 INFO: System started
2024-01-15 ERROR: Database connection failed
2024-01-15 INFO: User logged in
2024-01-15 WARNING: Disk space low
2024-01-15 ERROR: File not found
2024-01-15 INFO: Backup completed
DATA

echo "Testing grep skills..."
if grep -q "Engineering" test_employees.txt; then
    echo "✅ grep search working"
else
    echo "❌ grep search failed"
fi

echo "Testing cut skills..."
if cut -d',' -f1 test_employees.txt | grep -q "John Doe"; then
    echo "✅ column extraction working"
else
    echo "❌ column extraction failed"
fi

echo "Testing sed skills..."
if sed 's/Engineering/Dev/g' test_employees.txt | grep -q "Dev"; then
    echo "✅ text replacement working"
else
    echo "❌ text replacement failed"
fi

echo "Testing sort/uniq skills..."
unique_depts=$(cut -d',' -f2 test_employees.txt | sort | uniq | wc -l)
if [ $unique_depts -eq 3 ]; then
    echo "✅ sorting and counting unique values working"
else
    echo "❌ sorting/unique operations failed"
fi

echo "Testing error filtering..."
error_count=$(grep -c "ERROR" test_log.txt)
if [ $error_count -eq 2 ]; then
    echo "✅ error filtering working"
else
    echo "❌ error filtering failed"
fi

# Cleanup
rm -f test_employees.txt test_log.txt

echo ""
echo "🎉 Level 3 COMPLETED! You're a text processing wizard!"
echo "🔍 You can now search, filter, and transform text data!"
