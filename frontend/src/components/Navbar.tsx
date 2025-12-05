import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Play,
  Moon,
  Sun,
  Download,
  Undo2,
  Redo2,
  ChevronDown,
  FileCode,
  FileText,
  Box,
  User,
  Loader2,
  Gamepad2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  projectName: string;
  onRun: () => void;
  isRunning?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export default function Navbar({
  projectName,
  onRun,
  isRunning = false,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}: NavbarProps) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const handleExport = (type: 'js' | 'python' | 'react') => {
    const filename = {
      js: 'program.js',
      python: 'program.py',
      react: 'Component.jsx',
    }[type];

    // In a real app, this would download the actual generated code
    alert(`Exporting as ${filename}`);
    setShowExportMenu(false);
  };

  return (
    <nav className="h-14 bg-surface border-b border-white/10 flex items-center justify-between px-4 relative z-50">
      {/* Left Section - Logo & Project Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Box size={18} className="text-void" />
          </div>
          <span className="font-orbitron font-bold text-lg gradient-text">
            VisualCode
          </span>
        </div>

        <div className="h-6 w-px bg-white/20" />

        <div className="flex items-center gap-2">
          <span className="text-white/80 text-sm">{projectName}</span>
        </div>

        <div className="h-6 w-px bg-white/20" />

        {/* Games Button */}
        <Link
          to="/games"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${useLocation().pathname.startsWith('/games')
              ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
              : 'text-white/60 hover:text-neon-purple hover:bg-white/5'
            }`}
        >
          <Gamepad2 size={16} />
          <span>Games</span>
        </Link>
      </div>

      {/* Center Section - Undo/Redo */}
      <div className="flex items-center gap-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2 rounded-lg transition-all duration-200 ${canUndo
            ? 'text-white/80 hover:text-neon-cyan hover:bg-white/5'
            : 'text-white/30 cursor-not-allowed'
            }`}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2 rounded-lg transition-all duration-200 ${canRedo
            ? 'text-white/80 hover:text-neon-cyan hover:bg-white/5'
            : 'text-white/30 cursor-not-allowed'
            }`}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={18} />
        </button>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3">
        {/* Run Button */}
        <button
          onClick={onRun}
          disabled={isRunning}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${isRunning
            ? 'bg-white/10 text-white/50 cursor-wait'
            : 'bg-gradient-primary text-void hover:shadow-neon-cyan hover:scale-105'
            }`}
        >
          {isRunning ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Play size={16} />
          )}
          {isRunning ? 'Running...' : 'Run'}
        </button>

        {/* Export Dropdown */}
        <div className="relative" ref={exportRef}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:text-neon-cyan hover:bg-white/5 transition-all duration-200"
          >
            <Download size={16} />
            <span className="text-sm">Export</span>
            <ChevronDown size={14} className={`transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 py-2 rounded-lg glass-effect border border-white/10 shadow-lg">
              <button
                onClick={() => handleExport('js')}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-neon-cyan hover:bg-white/5 transition-colors"
              >
                <FileCode size={16} />
                JavaScript (.js)
              </button>
              <button
                onClick={() => handleExport('python')}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-neon-cyan hover:bg-white/5 transition-colors"
              >
                <FileText size={16} />
                Python (.py)
              </button>
              <button
                onClick={() => handleExport('react')}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-neon-cyan hover:bg-white/5 transition-colors"
              >
                <Box size={16} />
                React Component
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-white/80 hover:text-neon-gold hover:bg-white/5 transition-all duration-200"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Menu */}
        <button className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center hover:shadow-neon-purple transition-all duration-200">
          <User size={16} className="text-void" />
        </button>
      </div>
    </nav>
  );
}
