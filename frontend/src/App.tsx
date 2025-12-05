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

  const handleDropBlock = (definition: BlockDefinition, x: number, y: number) => {
    addBlock(definition.type, x, y);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setConsoleOutput(['▶ Running code...', '']);

    setTimeout(() => {
      const output = ['✅ Execution complete!', '', '--- Output ---'];

      const printRegex = language === 'javascript'
        ? /console\.log\((.+?)\)/g
        : /print\((.+?)\)/g;

      let match;
      while ((match = printRegex.exec(code)) !== null) {
        output.push(`> ${match[1].replace(/["']/g, '')}`);
      }

      if (output.length === 3) output.push('No output generated.');

      setConsoleOutput(output);
      setIsRunning(false);
    }, 1000);
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
  }; const [isCodePanelOpen, setIsCodePanelOpen] = useState(true);
  const { width: codePanelWidth, startResize: resizeCodePanel } = useResizablePanel(400);
  const [editedCode, setEditedCode] = useState('');

  // Add handleCodeChange function
  const handleCodeChange = (newCode: string) => {
    setEditedCode(newCode);
    // You can add logic here to update blocks based on code changes
  };

  const { width: leftWidth, startResize: resizeLeft } = useResizablePanel(220);
  const { width: rightWidth, startResize: resizeRight } = useResizablePanel(260);

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
          code={code} // or use editedCode if you want edited version
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