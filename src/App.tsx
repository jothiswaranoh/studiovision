import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import BlockLibrary from './components/BlockLibrary';
import VisualCanvas from './components/VisualCanvas';
import CodePanel from './components/CodePanel';
import FloatingActions from './components/FloatingActions';
import LearningTips from './components/LearningTips';
import { useBlocks } from './hooks/useBlocks';
import { useCodeGeneration, Language } from './hooks/useCodeGeneration';
import { BlockDefinition } from './data/blockDefinitions';

function AppContent() {
  const [projectName] = useState('My Visual Program');
  const [language, setLanguage] = useState<Language>('javascript');
  const [showLearningTips, setShowLearningTips] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

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

  // Code generation
  const { code, blockCodeMap } = useCodeGeneration(blocks, connections, language);

  // Handle dropping a block onto canvas
  const handleDropBlock = (definition: BlockDefinition, x: number, y: number) => {
    addBlock(definition.type, x, y);
  };

  // Handle running the code
  const handleRun = async () => {
    setIsRunning(true);
    setConsoleOutput(['▶ Running code...', '']);

    // Simulate execution
    setTimeout(() => {
      const output = ['✅ Execution complete!', '', '--- Output ---'];

      // Extract print/console.log statements
      const printRegex = language === 'javascript'
        ? /console\.log\((.+?)\)/g
        : /print\((.+?)\)/g;

      let match;
      while ((match = printRegex.exec(code)) !== null) {
        output.push(`> ${match[1].replace(/["']/g, '')}`);
      }

      if (output.length === 3) {
        output.push('No output generated.');
      }

      setConsoleOutput(output);
      setIsRunning(false);
    }, 1000);
  };

  // Handle code line hover (highlight corresponding block)
  const handleCodeLineHover = (line: number | null) => {
    if (line === null) {
      setHighlightedBlock(null);
      return;
    }

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
      {/* Top Navbar */}
      <Navbar
        projectName={projectName}
        onRun={handleRun}
        isRunning={isRunning}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane - Block Library */}
        <BlockLibrary onDragStart={() => { }} />

        {/* Center Pane - Visual Canvas */}
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

        {/* Right Pane - Code + Output */}
        <CodePanel
          code={code}
          language={language}
          onLanguageChange={setLanguage}
          consoleOutput={consoleOutput}
          onCodeLineHover={handleCodeLineHover}
          blocks={blocks}
          blockCodeMap={blockCodeMap}
          highlightedBlockId={highlightedBlockId}
        />
      </div>

      {/* Floating Action Buttons */}
      <FloatingActions
        language={language}
        onConvert={() => setLanguage(language === 'javascript' ? 'python' : 'javascript')}
      />

      {/* Learning Tips Panel */}
      {showLearningTips && (
        <LearningTips onClose={() => setShowLearningTips(false)} />
      )}

      {/* Toggle Learning Tips Button */}
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
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
