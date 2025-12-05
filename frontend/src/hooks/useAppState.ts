import { useState, useCallback } from 'react';
import { useResizablePanel } from './useResizablePanel';
import { useCodeGeneration } from './useCodeGeneration';
import { useBlocks } from './useBlocks';
import { BlockDefinition, BlockGroupKey, Language } from '../data/blockDefinitions';


export default function useAppState() {
    // UI State
    const [language, setLanguage] = useState<Language>('javascript');
    const [showLearningTips, setShowLearningTips] = useState(false);
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [activeGroup, setActiveGroup] = useState<BlockGroupKey>('programming');
    const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(true);
    const [isBlockLibraryOpen, setIsBlockLibraryOpen] = useState(true);
    const [isCodePanelOpen, setIsCodePanelOpen] = useState(true);
    const [editedCode, setEditedCode] = useState('');

    // Block Management
    const blockManager = useBlocks();
    const { code, blockCodeMap } = useCodeGeneration(
        blockManager.blocks,
        blockManager.connections,
        language
    );

    // Resizable Panels
    const leftPanel = useResizablePanel(220);
    const rightPanel = useResizablePanel(260);
    const codePanel = useResizablePanel(400);

    // Handlers
    const handleRun = useCallback(async () => {
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
    }, [code, language]);

    const handleCodeLineHover = useCallback((line: number | null) => {
        if (line === null) return blockManager.setHighlightedBlock(null);

        for (const [blockId, range] of blockCodeMap) {
            if (line >= range.start && line <= range.end) {
                blockManager.setHighlightedBlock(blockId);
                return;
            }
        }
        blockManager.setHighlightedBlock(null);
    }, [blockCodeMap, blockManager]);

    const handleDropBlock = useCallback((definition: BlockDefinition, x: number, y: number) => {
        blockManager.addBlock(definition.type, x, y);
    }, [blockManager]);

    const handleCodeChange = useCallback((newCode: string) => {
        setEditedCode(newCode);
        // Add logic here to update blocks based on code changes
    }, []);

    // Toggle Handlers
    const toggleCategorySelector = useCallback(() => {
        setIsCategorySelectorOpen(prev => !prev);
    }, []);

    const toggleBlockLibrary = useCallback(() => {
        setIsBlockLibraryOpen(prev => !prev);
    }, []);

    const toggleCodePanel = useCallback(() => {
        setIsCodePanelOpen(prev => !prev);
    }, []);

    const toggleLearningTips = useCallback(() => {
        setShowLearningTips(prev => !prev);
    }, []);

    return {
        // UI State
        language,
        setLanguage,
        showLearningTips,
        consoleOutput,
        isRunning,
        activeGroup,
        setActiveGroup,
        isCategorySelectorOpen,
        isBlockLibraryOpen,
        isCodePanelOpen,
        editedCode,

        // Block Management
        blocks: blockManager.blocks,
        connections: blockManager.connections,
        selection: blockManager.selection,
        hoveredBlockId: blockManager.hoveredBlockId,
        highlightedBlockId: blockManager.highlightedBlockId,
        blockCodeMap,
        code,

        // Panel Widths
        leftWidth: leftPanel.width,
        rightWidth: rightPanel.width,
        codePanelWidth: codePanel.width,

        // Resize Functions
        resizeLeft: leftPanel.startResize,
        resizeRight: rightPanel.startResize,
        resizeCodePanel: codePanel.startResize,

        // Handlers
        handleRun,
        handleCodeLineHover,
        handleDropBlock,
        handleCodeChange,

        // Toggle Handlers
        toggleCategorySelector,
        toggleBlockLibrary,
        toggleCodePanel,
        toggleLearningTips,

        // Block Manager Functions
        updateBlockPosition: blockManager.updateBlockPosition,
        updateBlockValue: blockManager.updateBlockValue,
        addConnection: blockManager.addConnection,
        removeConnection: blockManager.removeConnection,
        selectBlock: blockManager.selectBlock,
        clearSelection: blockManager.clearSelection,
        deleteSelected: blockManager.deleteSelected,
        setHoveredBlock: blockManager.setHoveredBlock,
        setHighlightedBlock: blockManager.setHighlightedBlock,
        undo: blockManager.undo,
        redo: blockManager.redo,
        canUndo: blockManager.canUndo,
        canRedo: blockManager.canRedo,
        resetCanvas: blockManager.resetCanvas,
        addBlock: blockManager.addBlock,
    };
}