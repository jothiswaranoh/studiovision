import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from './components/Toast';
import AppLayout from './Layout/AppLayout';
import CanvasManager from './Layout/CanvasManager';
import SidebarCategorySelector from './components/SidebarCategorySelector';
import SidebarBlockLibrary from './components/SidebarBlockLibrary';
import GamesPage from './components/GamesPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import OnboardingPage from './components/OnboardingPage';
import RoadmapPage from './components/RoadmapPage';
import ProtectedRoute from './components/ProtectedRoute';
import useAppState from './hooks/useAppState';

function AppContent() {
  const appState = useAppState();

  return (
    <AppLayout
      // Layout State
      isCategorySelectorOpen={appState.isCategorySelectorOpen}
      isBlockLibraryOpen={appState.isBlockLibraryOpen}
      isCodePanelOpen={appState.isCodePanelOpen}
      showLearningTips={appState.showLearningTips}

      // UI Functions
      onToggleCategorySelector={appState.toggleCategorySelector}
      onToggleBlockLibrary={appState.toggleBlockLibrary}
      onToggleCodePanel={appState.toggleCodePanel}
      onToggleLearningTips={appState.toggleLearningTips}

      // Navbar Props
      projectName="My Visual Program"
      onRun={appState.handleRun}
      isRunning={appState.isRunning}
      canUndo={appState.canUndo}
      canRedo={appState.canRedo}

      // Code Panel Props
      codePanelProps={{
        code: appState.code,
        language: appState.language,
        onLanguageChange: appState.setLanguage,
        onCodeChange: appState.handleCodeChange,
        onBlockValueChange: appState.updateBlockValue,
        consoleOutput: appState.consoleOutput,
        onCodeLineHover: appState.handleCodeLineHover,
        blocks: appState.blocks,
        blockCodeMap: appState.blockCodeMap,
        highlightedBlockId: appState.highlightedBlockId,
        width: appState.codePanelWidth,
        onResize: appState.resizeCodePanel,
      }}

      // Canvas Content
      canvasContent={
        <>
          {/* Left Sidebar - Category Selector */}
          <SidebarCategorySelector
            selectedGroup={appState.activeGroup}
            onSelectGroup={appState.setActiveGroup}
            width={appState.leftWidth}
            onResize={appState.resizeLeft}
            isOpen={appState.isCategorySelectorOpen}
            onToggle={appState.toggleCategorySelector}
          />

          {/* Middle Sidebar - Block Library */}
          <SidebarBlockLibrary
            selectedGroup={appState.activeGroup}
            onDragStart={() => { }}
            width={appState.rightWidth}
            onResize={appState.resizeRight}
            isOpen={appState.isBlockLibraryOpen}
            onToggle={appState.toggleBlockLibrary}
          />

          {/* Main Canvas */}
          <CanvasManager
            blocks={appState.blocks}
            connections={appState.connections}
            selection={appState.selection}
            hoveredBlockId={appState.hoveredBlockId}
            highlightedBlockId={appState.highlightedBlockId}
            onDropBlock={appState.handleDropBlock}
            onBlockSelect={appState.selectBlock}
            onBlockMove={appState.updateBlockPosition}
            onBlockHover={appState.setHoveredBlock}
            onBlockValueChange={appState.updateBlockValue}
            onConnectionCreate={appState.addConnection}
            onConnectionRemove={appState.removeConnection}
            onCanvasClick={appState.clearSelection}
            onDeleteSelected={appState.deleteSelected}
            onReset={appState.resetCanvas}
            canUndo={appState.canUndo}
            canRedo={appState.canRedo}
            onUndo={appState.undo}
            onRedo={appState.redo}
          />
        </>
      }
    />
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <RoadmapPage />
              </ProtectedRoute>
            }
          />

          {/* GAMES ROUTES */}
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:language" element={<GamesPage />} />
          <Route path="/games/:language/:level" element={<GamesPage />} />

          {/* CATCH-ALL — Redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;