import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import SidebarCategorySelector from './components/SidebarCategorySelector';
import SidebarBlockLibrary from './components/SidebarBlockLibrary';
import CodePanel from './components/CodePanel';
import { useBlocks } from './hooks/useBlocks';
import { useCodeGeneration } from './hooks/useCodeGeneration';
import { BlockDefinition, BlockGroupKey, Language } from './data/blockDefinitions';
import VisualCanvas from './components/VisualCanvas';
import FloatingActions from './components/FloatingActions';
import LearningTips from './components/LearningTips';
import { useResizablePanel } from './hooks/useResizablePanel';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function AppContent() {
  const [projectName] = useState('My Visual Program');
  const [language, setLanguage] = useState<Language>('javascript');
  const [showLearningTips, setShowLearningTips] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeGroup, setActiveGroup] = useState<BlockGroupKey>('programming');
  const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(true);
  const [isBlockLibraryOpen, setIsBlockLibraryOpen] = useState(true);
  const [isCodePanelOpen, setIsCodePanelOpen] = useState(true);
  const [editedCode, setEditedCode] = useState('');

  // Block management
  const {
    blocks,
    connections,
    selection,
    hoveredBlockId,
    highlightedBlockId,
    addBlock,
    updateBlockPosition,
    updateBlockValue,
    addConnection,
    removeConnection,
    selectBlock,
    clearSelection,
    deleteSelected,
    setHoveredBlock,
    setHighlightedBlock,
    undo,
    redo,
    canUndo,
    canRedo,
    resetCanvas,
  } = useBlocks();

  const { code, blockCodeMap } = useCodeGeneration(blocks, connections, language);

  // Resizable panels
  const { width: codePanelWidth, startResize: resizeCodePanel } = useResizablePanel(400);
  const { width: leftWidth, startResize: resizeLeft } = useResizablePanel(220);
  const { width: rightWidth, startResize: resizeRight } = useResizablePanel(260);

  const handleDropBlock = (definition: BlockDefinition, x: number, y: number) => {
    addBlock(definition.type, x, y);
  };

  const handleCodeChange = (newCode: string) => {
    setEditedCode(newCode);
  };

  // Enhanced Python-specific syntax checking
  const checkPythonSyntax = (code: string): string[] => {
    const errors: string[] = [];
    const lines = code.split('\n');
    
    // Track indentation levels
    const indentationStack: number[] = [0];
    let inMultilineString = false;
    let multilineStringChar = '';
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (trimmedLine === '') return;
      
      // Check for multiline strings start/end
      if (!inMultilineString) {
        if (trimmedLine.includes('"""') || trimmedLine.includes("'''")) {
          // Check if it's opening or closing
          const tripleDouble = (line.match(/"""/g) || []).length;
          const tripleSingle = (line.match(/'''/g) || []).length;
          
          if (tripleDouble % 2 !== 0) {
            inMultilineString = !inMultilineString;
            multilineStringChar = '"""';
          } else if (tripleSingle % 2 !== 0) {
            inMultilineString = !inMultilineString;
            multilineStringChar = "'''";
          }
        }
      } else {
        // Inside multiline string, check for end
        if (line.includes(multilineStringChar)) {
          const count = (line.match(new RegExp(multilineStringChar, 'g')) || []).length;
          if (count % 2 !== 0) {
            inMultilineString = false;
            multilineStringChar = '';
          }
        }
        return; // Skip syntax checking inside multiline strings
      }
      
      // Check indentation
      const leadingSpaces = line.match(/^ */)?.[0].length || 0;
      const expectedIndent = indentationStack[indentationStack.length - 1];
      
      if (leadingSpaces % 4 !== 0 && leadingSpaces !== expectedIndent) {
        errors.push(`Line ${lineNum}: Indentation must be a multiple of 4 spaces`);
      }
      
      if (leadingSpaces > expectedIndent) {
        // Check if previous line expects indentation
        if (index > 0) {
          const prevLine = lines[index - 1].trim();
          const expectsIndent = prevLine.endsWith(':') && 
                               !prevLine.startsWith('#') &&
                               !isInString(lines[index - 1], prevLine.indexOf(':'));
          if (!expectsIndent) {
            errors.push(`Line ${lineNum}: Unexpected indentation`);
          } else {
            indentationStack.push(leadingSpaces);
          }
        }
      } else if (leadingSpaces < expectedIndent) {
        // Dedent - pop from stack until we find matching level
        while (indentationStack.length > 1 && leadingSpaces < indentationStack[indentationStack.length - 1]) {
          indentationStack.pop();
        }
        if (leadingSpaces !== indentationStack[indentationStack.length - 1]) {
          errors.push(`Line ${lineNum}: Inconsistent indentation`);
        }
      }
      
      // Check for common Python errors
      
      // 1. Check for assignment in condition (a = 8 instead of a == 8)
      const ifMatch = line.match(/^\s*if\s+(.+?):/);
      if (ifMatch) {
        const condition = ifMatch[1].trim();
        // Look for assignment (=) that's not ==, !=, <=, >=, or part of a function call
        if (condition.includes('=') && 
            !condition.includes('==') && 
            !condition.includes('!=') && 
            !condition.includes('<=') && 
            !condition.includes('>=') &&
            !condition.includes('+=') &&
            !condition.includes('-=') &&
            !condition.includes('*=') &&
            !condition.includes('/=') &&
            !condition.includes('%=') &&
            !condition.includes('//=') &&
            !condition.includes('**=') &&
            !condition.includes('&=') &&
            !condition.includes('|=') &&
            !condition.includes('^=') &&
            !condition.includes('<<=') &&
            !condition.includes('>>=')) {
          
          // Check if it's really an assignment and not in a string
          const equalsIndex = condition.indexOf('=');
          const beforeEquals = condition.substring(0, equalsIndex);
          const afterEquals = condition.substring(equalsIndex + 1);
          
          if (!isInString(condition, equalsIndex) && 
              !beforeEquals.trim().endsWith('<') &&
              !beforeEquals.trim().endsWith('>') &&
              !beforeEquals.trim().endsWith('!') &&
              !beforeEquals.trim().endsWith('+') &&
              !beforeEquals.trim().endsWith('-') &&
              !beforeEquals.trim().endsWith('*') &&
              !beforeEquals.trim().endsWith('/') &&
              !beforeEquals.trim().endsWith('%') &&
              !beforeEquals.trim().endsWith('&') &&
              !beforeEquals.trim().endsWith('|') &&
              !beforeEquals.trim().endsWith('^') &&
              !beforeEquals.trim().endsWith('<<') &&
              !beforeEquals.trim().endsWith('>>')) {
            
            // Make sure it's not a keyword argument in a function call
            if (!condition.includes('(') || condition.indexOf('(') > equalsIndex) {
              errors.push(`Line ${lineNum}: Assignment (=) in condition. Did you mean == (comparison)?`);
            }
          }
        }
      }
      
      // 2. Check for missing colon after control structures
      const controlKeywords = ['if', 'elif', 'else', 'for', 'while', 'def', 'class', 'try', 'except', 'finally', 'with'];
      for (const keyword of controlKeywords) {
        const regex = new RegExp(`^\\s*${keyword}\\b(?!:)`);
        if (regex.test(line) && !line.includes(':') && !line.trim().startsWith('#')) {
          // Check if it's really a keyword and not part of a string or variable name
          const keywordIndex = line.indexOf(keyword);
          if (!isInString(line, keywordIndex)) {
            errors.push(`Line ${lineNum}: Missing colon after '${keyword}'`);
            break;
          }
        }
      }
      
      // 3. Check for unmatched parentheses in print statements
      if (line.includes('print(')) {
        let parenBalance = 0;
        let inString = false;
        let stringChar = '';
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const prevChar = i > 0 ? line[i - 1] : '';
          
          // Handle string literals
          if (!inString && (char === '"' || char === "'") && prevChar !== '\\') {
            inString = true;
            stringChar = char;
          } else if (inString && char === stringChar && prevChar !== '\\') {
            inString = false;
            stringChar = '';
          }
          
          // Count parentheses when not in string
          if (!inString) {
            if (char === '(') parenBalance++;
            if (char === ')') parenBalance--;
          }
        }
        
        if (parenBalance > 0) {
          errors.push(`Line ${lineNum}: Missing closing parenthesis in print statement`);
        } else if (parenBalance < 0) {
          errors.push(`Line ${lineNum}: Too many closing parentheses in print statement`);
        }
        
        // Check for unterminated strings in print
        if (inString) {
          errors.push(`Line ${lineNum}: Unterminated string in print statement`);
        }
      }
      
      // 4. Check for semicolons (Python doesn't need them)
      if (line.includes(';') && !line.trim().startsWith('#')) {
        const semicolonIndex = line.indexOf(';');
        if (!isInString(line, semicolonIndex)) {
          // Allow single semicolon at end of line
          const afterSemicolon = line.substring(semicolonIndex + 1).trim();
          if (afterSemicolon && !afterSemicolon.startsWith('#')) {
            errors.push(`Line ${lineNum}: Unexpected semicolon. Python statements don't need semicolons.`);
          }
        }
      }
      
      // 5. Check for unmatched quotes
      let singleQuotes = 0;
      let doubleQuotes = 0;
      let inStringType = '';
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const prevChar = i > 0 ? line[i - 1] : '';
        
        if (inStringType === '') {
          if (char === "'" && prevChar !== '\\') {
            singleQuotes++;
            inStringType = "'";
          } else if (char === '"' && prevChar !== '\\') {
            doubleQuotes++;
            inStringType = '"';
          }
        } else if (char === inStringType && prevChar !== '\\') {
          inStringType = '';
        }
      }
      
      if (inStringType !== '') {
        errors.push(`Line ${lineNum}: Unterminated string (missing ${inStringType})`);
      }
    });
    
    return errors;
  };
  
  // Helper function to check if a position is inside a string
  const isInString = (line: string, position: number): boolean => {
    let inString = false;
    let stringChar = '';
    
    for (let i = 0; i < Math.min(position, line.length); i++) {
      const char = line[i];
      const prevChar = i > 0 ? line[i - 1] : '';
      
      if (!inString && (char === '"' || char === "'") && prevChar !== '\\') {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar && prevChar !== '\\') {
        inString = false;
        stringChar = '';
      }
    }
    
    return inString;
  };

  const handleRun = async () => {
    setIsRunning(true);

    // Prefer the code the user is editing; fall back to generated code
    const sourceCode = editedCode.trim().length > 0 ? editedCode : code;

    // Reset console and show running status
    setConsoleOutput(['▶ Running code...', '']);

    // Language-specific syntax checking
    let syntaxErrors: string[] = [];
    
    if (language === 'python') {
      syntaxErrors = checkPythonSyntax(sourceCode);
    } else {
      // Basic syntax checking for other languages
      syntaxErrors = checkBasicSyntax(sourceCode, language);
    }
    
    if (syntaxErrors.length > 0) {
      setConsoleOutput([
        `❌ Syntax error in ${language} code`,
        '',
        ...syntaxErrors,
        '',
        'Fix the errors and try again.'
      ]);
      setIsRunning(false);
      return;
    }

    // Simulate execution
    setTimeout(() => {
      try {
        const output = ['✅ Execution complete!', '', '--- Output ---'];

        // For Python, simulate actual execution
        if (language === 'python') {
          // Simple Python interpreter simulation
          const lines = sourceCode.split('\n');
          const variables: Record<string, any> = {};
          let printedOutput: string[] = [];
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Handle variable assignment
            const assignMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
            if (assignMatch) {
              const [, varName, value] = assignMatch;
              // Simple value evaluation (for numbers and strings)
              let evaluatedValue = value.trim();
              
              // Remove quotes from strings
              if ((evaluatedValue.startsWith('"') && evaluatedValue.endsWith('"')) ||
                  (evaluatedValue.startsWith("'") && evaluatedValue.endsWith("'"))) {
                evaluatedValue = evaluatedValue.substring(1, evaluatedValue.length - 1);
              }
              
              // Try to parse as number
              const asNumber = parseFloat(evaluatedValue);
              if (!isNaN(asNumber) && evaluatedValue === asNumber.toString()) {
                variables[varName] = asNumber;
              } else {
                variables[varName] = evaluatedValue;
              }
              continue;
            }
            
            // Handle print statements
            const printMatch = line.match(/print\((.+)\)/);
            if (printMatch) {
              let content = printMatch[1].trim();
              
              // Remove surrounding quotes if present
              if ((content.startsWith('"') && content.endsWith('"')) ||
                  (content.startsWith("'") && content.endsWith("'"))) {
                content = content.substring(1, content.length - 1);
              }
              
              // Replace variables with their values
              for (const [varName, value] of Object.entries(variables)) {
                content = content.replace(new RegExp(`\\b${varName}\\b`, 'g'), String(value));
              }
              
              printedOutput.push(content);
              continue;
            }
            
            // Handle if statements (simplified)
            const ifMatch = line.match(/^if\s+(.+):$/);
            if (ifMatch) {
              const condition = ifMatch[1].trim();
              
              // Simple condition evaluation
              let conditionResult = false;
              
              // Check for equality comparison
              const eqMatch = condition.match(/(\w+)\s*==\s*(.+)/);
              if (eqMatch) {
                const [, left, right] = eqMatch;
                const leftValue = variables[left] !== undefined ? variables[left] : left;
                let rightValue = right.trim();
                
                // Remove quotes from right side
                if ((rightValue.startsWith('"') && rightValue.endsWith('"')) ||
                    (rightValue.startsWith("'") && rightValue.endsWith("'"))) {
                  rightValue = rightValue.substring(1, rightValue.length - 1);
                }
                
                // Try to parse as number
                const rightNum = parseFloat(rightValue);
                if (!isNaN(rightNum) && rightValue === rightNum.toString()) {
                  rightValue = rightNum;
                }
                
                conditionResult = String(leftValue) === String(rightValue);
              }
              
              // If condition is false, skip indented block
              if (!conditionResult) {
                // Find the end of the indented block
                let j = i + 1;
                const currentIndent = lines[i].match(/^ */)?.[0].length || 0;
                
                while (j < lines.length) {
                  const nextIndent = lines[j].match(/^ */)?.[0].length || 0;
                  if (nextIndent <= currentIndent && lines[j].trim() !== '') {
                    break;
                  }
                  j++;
                }
                i = j - 1;
              }
            }
          }
          
          // Add output to console
          if (printedOutput.length > 0) {
            printedOutput.forEach(msg => output.push(`> ${msg}`));
          } else {
            output.push('No output generated.');
            output.push('Add print() statements to see output.');
          }
        } else {
          // For other languages, use the existing output extraction
          output.push('(Output simulation for other languages)');
        }

        setConsoleOutput(output);
      } catch (error) {
        const err = error as Error;
        setConsoleOutput([
          '❌ Runtime Error',
          '',
          err.message || 'An error occurred during execution',
          '',
          'Check your code for logical errors.'
        ]);
      } finally {
        setIsRunning(false);
      }
    }, 800);
  };

  // Basic syntax checking for other languages (simplified)
  const checkBasicSyntax = (code: string, lang: Language): string[] => {
    const errors: string[] = [];
    
    // Check for unmatched brackets
    let parenCount = 0;
    let braceCount = 0;
    let bracketCount = 0;
    
    for (const char of code) {
      if (char === '(') parenCount++;
      if (char === ')') parenCount--;
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      if (char === '[') bracketCount++;
      if (char === ']') bracketCount--;
    }
    
    if (parenCount !== 0) errors.push(`Unmatched parentheses: ${parenCount > 0 ? 'missing )' : 'extra )'}`);
    if (braceCount !== 0) errors.push(`Unmatched braces: ${braceCount > 0 ? 'missing }' : 'extra }'}`);
    if (bracketCount !== 0) errors.push(`Unmatched brackets: ${bracketCount > 0 ? 'missing ]' : 'extra ]'}`);
    
    return errors;
  };

  const handleCodeLineHover = (line: number | null) => {
    if (line === null) return setHighlightedBlock(null);

    for (const [blockId, range] of blockCodeMap) {
      if (line >= range.start && line <= range.end) {
        setHighlightedBlock(blockId);
        return;
      }
    }
    setHighlightedBlock(null);
  };

  return (
    <div className="h-screen flex flex-col bg-void text-white overflow-hidden">
      <Navbar
        projectName={projectName}
        onRun={handleRun}
        isRunning={isRunning}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Category Selector */}
        <SidebarCategorySelector
          selectedGroup={activeGroup}
          onSelectGroup={setActiveGroup}
          width={leftWidth}
          onResize={resizeLeft}
          isOpen={isCategorySelectorOpen}
          onToggle={setIsCategorySelectorOpen}
        />

        {/* Middle Sidebar - Block Library */}
        <SidebarBlockLibrary
          selectedGroup={activeGroup}
          onDragStart={() => { }}
          width={rightWidth}
          onResize={resizeRight}
          isOpen={isBlockLibraryOpen}
          onToggle={setIsBlockLibraryOpen}
        />

        {/* Main Canvas Area */}
        <div className="flex-1 relative">
          {/* Toggle buttons for sidebars when collapsed */}
          {!isCategorySelectorOpen && (
            <button
              onClick={() => setIsCategorySelectorOpen(true)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-50 p-2 bg-surface border border-white/10 rounded-r-md text-white/60 hover:text-neon-cyan hover:bg-surface/80 transition-all backdrop-blur-sm"
              title="Open categories"
            >
              <ChevronRight size={16} />
            </button>
          )}

          {!isBlockLibraryOpen && (
            <button
              onClick={() => setIsBlockLibraryOpen(true)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-50 p-2 bg-void/80 border border-white/10 border-r-0 rounded-l-md text-white/60 hover:text-neon-cyan hover:bg-void transition-all backdrop-blur-sm"
              title="Open block library"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          <VisualCanvas
            blocks={blocks}
            connections={connections}
            selection={selection}
            hoveredBlockId={hoveredBlockId}
            highlightedBlockId={highlightedBlockId}
            onDropBlock={handleDropBlock}
            onBlockSelect={selectBlock}
            onBlockMove={updateBlockPosition}
            onBlockHover={setHoveredBlock}
            onBlockValueChange={updateBlockValue}
            onConnectionCreate={addConnection}
            onConnectionRemove={removeConnection}
            onCanvasClick={clearSelection}
            onDeleteSelected={deleteSelected}
            onReset={resetCanvas}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
          />
        </div>

        {/* Right Panel - Code */}
        <CodePanel
          code={code}
          language={language}
          onLanguageChange={setLanguage}
          onCodeChange={handleCodeChange}
          consoleOutput={consoleOutput}
          onCodeLineHover={handleCodeLineHover}
          blocks={blocks}
          blockCodeMap={blockCodeMap}
          highlightedBlockId={highlightedBlockId}
          width={codePanelWidth}
          onResize={resizeCodePanel}
          isOpen={isCodePanelOpen}
          onToggle={setIsCodePanelOpen}
        />
      </div>

      <FloatingActions
        language={language}
        onConvert={() => setLanguage(language === 'javascript' ? 'python' : 'javascript')}
      />

      {showLearningTips && (
        <LearningTips onClose={() => setShowLearningTips(false)} />
      )}

      <button
        onClick={() => setShowLearningTips(!showLearningTips)}
        className="fixed bottom-4 left-4 px-4 py-2 rounded-lg glass-effect text-neon-cyan text-sm font-medium hover:bg-neon-cyan/10 transition-all duration-300 z-40"
      >
        {showLearningTips ? '✕ Hide Tips' : '💡 Learning Tips'}
      </button>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* MAIN APP ROUTE */}
          <Route path="/" element={<AppContent />} />

          {/* CATCH-ALL — Redirect all routes to main page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;