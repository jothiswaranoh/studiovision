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

        // Prefer the code the user is editing; fall back to generated code
        const sourceCode = editedCode.trim().length > 0 ? editedCode : code;

        // Reset console and show running status
        setConsoleOutput(['▶ Running code...', '']);

        // Basic syntax checking for JavaScript / TypeScript
        if (language === 'javascript' || language === 'typescript') {
            try {
                // Parse only, do not execute
                // eslint-disable-next-line no-new-func
                new Function(sourceCode);
            } catch (err) {
                const error = err as Error;
                setConsoleOutput([
                    '❌ Syntax error in your code',
                    '',
                    error.message,
                ]);
                setIsRunning(false);
                return;
            }
        }

        setTimeout(() => {
            const output = ['✅ Execution complete!', '', '--- Output ---'];

            let printed = false;

            const pushClean = (raw: string) => {
                const cleaned = raw
                    .replace(/["'`]/g, '')
                    .replace(/;$/, '')
                    .trim();
                if (cleaned) {
                    output.push(`> ${cleaned}`);
                    printed = true;
                }
            };

            if (language === 'javascript' || language === 'typescript') {
                const regex = /console\.log\(([^)]*)\)/g;
                let match;
                while ((match = regex.exec(sourceCode)) !== null) {
                    pushClean(match[1]);
                }
            } else if (language === 'python') {
                const regex = /print\(([^)]*)\)/g;
                let match;
                while ((match = regex.exec(sourceCode)) !== null) {
                    pushClean(match[1]);
                }
            } else if (language === 'java') {
                const regex = /System\.out\.println\(([^)]*)\)/g;
                let match;
                while ((match = regex.exec(sourceCode)) !== null) {
                    pushClean(match[1]);
                }
            } else if (language === 'c') {
                const regex = /printf\(([^)]*)\)/g;
                let match;
                while ((match = regex.exec(sourceCode)) !== null) {
                    pushClean(match[1]);
                }
            } else if (language === 'cpp') {
                const regex = /std::cout\s*<<\s*([^;]+);/g;
                let match;
                while ((match = regex.exec(sourceCode)) !== null) {
                    pushClean(match[1]);
                }
            } else if (language === 'ruby') {
                const regex = /(?:puts|print)\s+(.+)/g;
                let match;
                while ((match = regex.exec(sourceCode)) !== null) {
                    pushClean(match[1]);
                }
            }

            if (!printed) {
                // Fallback: echo the user's code so console isn't empty
                const lines = sourceCode.split('\n');
                if (lines.length > 0) {
                    lines.forEach((line) => {
                        const cleanedLine = line.trim();
                        if (cleanedLine.length > 0) {
                            output.push(`> ${cleanedLine}`);
                        }
                    });
                } else {
                    output.push('No output generated. Add a Print block or use print()/console.log().');
                }
            }

            setConsoleOutput(output);
            setIsRunning(false);
        }, 1000);
    }, [code, editedCode, language]);

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

        // Parse the code to extract block value changes
        // We'll do this with a debounce to avoid too many updates
        // For now, we'll parse immediately but could add debouncing later

        // Note: Actual parsing will be done in CodePanel with useCodeParser
        // This just stores the edited code
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