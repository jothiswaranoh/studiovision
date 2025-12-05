#!/bin/bash
echo "📝 Starting Level 3 Challenge..."

# Create sample files
cat > employees.txt <<'SAMPLE'
John Doe,Engineering,50000
Jane Smith,Marketing,60000
Bob Johnson,Engineering,55000
Alice Brown,Sales,48000
Charlie Wilson,Engineering,52000
SAMPLE

cat > logfile.txt <<'SAMPLE'
2024-01-15 INFO: System started
2024-01-15 ERROR: Database connection failed
2024-01-15 INFO: User logged in
2024-01-15 WARNING: Disk space low
2024-01-15 ERROR: File not found
2024-01-15 INFO: Backup completed
SAMPLE

echo "Sample files created: employees.txt, logfile.txt"
echo ""
echo "1. Find all Engineering department employees:"
echo "   grep 'Engineering' employees.txt"
echo ""
echo "2. Extract just the names from employees.txt:"
echo "   cut -d',' -f1 employees.txt"
echo ""
echo "3. Find all ERROR messages in logfile:"
echo "   grep 'ERROR' logfile.txt"
echo ""
echo "4. Sort employees by name:"
echo "   sort employees.txt"
echo ""
echo "5. Replace 'Engineering' with 'Dev' in employees:"
echo "   sed 's/Engineering/Dev/g' employees.txt"
echo ""
echo "6. Count unique departments:"
echo "   cut -d',' -f2 employees.txt | sort | uniq"
