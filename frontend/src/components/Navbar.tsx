import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  LogOut,
  Settings,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import showToast from './Toast';

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
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleLogout = () => {
    logout();
    showToast.success('Logged out successfully');
    navigate('/login');
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
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <User size={16} className="text-void" />
            </div>
            {user && (
              <span className="text-sm text-white/80 max-w-[100px] truncate hidden md:block">
                {user.name}
              </span>
            )}
            <ChevronDown size={14} className={`text-white/60 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 py-2 rounded-lg glass-effect border border-white/10 shadow-lg">
              {/* User Info */}
              {user && (
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-white/60 truncate">{user.email}</p>
                  {user.role === 'admin' && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] bg-neon-purple/20 text-neon-purple rounded-full">
                      Admin
                    </span>
                  )}
                </div>
              )}

              {/* Menu Items */}
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-neon-cyan hover:bg-white/5 transition-colors"
              >
                <Settings size={16} />
                Settings
              </button>

              <div className="my-1 border-t border-white/10" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
