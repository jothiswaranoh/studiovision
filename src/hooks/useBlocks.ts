import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BlockDefinition, getBlockDefinition } from '../data/blockDefinitions';

// Block instance on canvas
export interface CanvasBlock {
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    values: Record<string, string>;
    definition: BlockDefinition;
}

// Connection between blocks
export interface Connection {
    id: string;
    fromBlockId: string;
    fromPortId: string;
    toBlockId: string;
    toPortId: string;
}

// Selection state
export interface Selection {
    blockIds: string[];
    connectionIds: string[];
}

// History entry for undo/redo
interface HistoryEntry {
    blocks: CanvasBlock[];
    connections: Connection[];
}

// Hook return type
export interface UseBlocksReturn {
    blocks: CanvasBlock[];
    connections: Connection[];
    selection: Selection;
    hoveredBlockId: string | null;
    highlightedBlockId: string | null;
    addBlock: (type: string, x: number, y: number) => CanvasBlock | null;
    removeBlock: (id: string) => void;
    updateBlockPosition: (id: string, x: number, y: number) => void;
    updateBlockValue: (id: string, key: string, value: string) => void;
    addConnection: (fromBlockId: string, fromPortId: string, toBlockId: string, toPortId: string) => boolean;
    removeConnection: (id: string) => void;
    selectBlock: (id: string, addToSelection?: boolean) => void;
    selectConnection: (id: string, addToSelection?: boolean) => void;
    clearSelection: () => void;
    deleteSelected: () => void;
    setHoveredBlock: (id: string | null) => void;
    setHighlightedBlock: (id: string | null) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    resetCanvas: () => void;
}

const MAX_HISTORY = 50;

export const useBlocks = (): UseBlocksReturn => {
    const [blocks, setBlocks] = useState<CanvasBlock[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [selection, setSelection] = useState<Selection>({ blockIds: [], connectionIds: [] });
    const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
    const [highlightedBlockId, setHighlightedBlockId] = useState<string | null>(null);

    // History for undo/redo
    const historyRef = useRef<HistoryEntry[]>([]);
    const historyIndexRef = useRef<number>(-1);

    // Save current state to history
    const saveToHistory = useCallback(() => {
        const newEntry: HistoryEntry = {
            blocks: JSON.parse(JSON.stringify(blocks)),
            connections: JSON.parse(JSON.stringify(connections)),
        };

        // Remove any redo entries
        historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
        historyRef.current.push(newEntry);

        // Limit history size
        if (historyRef.current.length > MAX_HISTORY) {
            historyRef.current = historyRef.current.slice(-MAX_HISTORY);
        }

        historyIndexRef.current = historyRef.current.length - 1;
    }, [blocks, connections]);

    // Add a new block
    const addBlock = useCallback((type: string, x: number, y: number): CanvasBlock | null => {
        const definition = getBlockDefinition(type);
        if (!definition) return null;

        saveToHistory();

        const newBlock: CanvasBlock = {
            id: uuidv4(),
            type,
            x,
            y,
            width: 200,
            height: 80 + Math.max(definition.inputs.length, definition.outputs.length) * 24,
            values: definition.defaultValue ? { ...definition.defaultValue } as Record<string, string> : {},
            definition,
        };

        setBlocks((prev) => [...prev, newBlock]);
        return newBlock;
    }, [saveToHistory]);

    // Remove a block
    const removeBlock = useCallback((id: string) => {
        saveToHistory();
        setBlocks((prev) => prev.filter((b) => b.id !== id));
        // Also remove any connections to/from this block
        setConnections((prev) =>
            prev.filter((c) => c.fromBlockId !== id && c.toBlockId !== id)
        );
        setSelection((prev) => ({
            ...prev,
            blockIds: prev.blockIds.filter((bid) => bid !== id),
        }));
    }, [saveToHistory]);

    // Update block position
    const updateBlockPosition = useCallback((id: string, x: number, y: number) => {
        setBlocks((prev) =>
            prev.map((b) => (b.id === id ? { ...b, x, y } : b))
        );
    }, []);

    // Update block value
    const updateBlockValue = useCallback((id: string, key: string, value: string) => {
        setBlocks((prev) =>
            prev.map((b) =>
                b.id === id ? { ...b, values: { ...b.values, [key]: value } } : b
            )
        );
    }, []);

    // Add connection
    const addConnection = useCallback((
        fromBlockId: string,
        fromPortId: string,
        toBlockId: string,
        toPortId: string
    ): boolean => {
        // Validate connection
        const fromBlock = blocks.find((b) => b.id === fromBlockId);
        const toBlock = blocks.find((b) => b.id === toBlockId);

        if (!fromBlock || !toBlock) return false;

        // Check if connection already exists
        const exists = connections.some(
            (c) =>
                c.fromBlockId === fromBlockId &&
                c.fromPortId === fromPortId &&
                c.toBlockId === toBlockId &&
                c.toPortId === toPortId
        );

        if (exists) return false;

        saveToHistory();

        const newConnection: Connection = {
            id: uuidv4(),
            fromBlockId,
            fromPortId,
            toBlockId,
            toPortId,
        };

        setConnections((prev) => [...prev, newConnection]);
        return true;
    }, [blocks, connections, saveToHistory]);

    // Remove connection
    const removeConnection = useCallback((id: string) => {
        saveToHistory();
        setConnections((prev) => prev.filter((c) => c.id !== id));
        setSelection((prev) => ({
            ...prev,
            connectionIds: prev.connectionIds.filter((cid) => cid !== id),
        }));
    }, [saveToHistory]);

    // Select block
    const selectBlock = useCallback((id: string, addToSelection = false) => {
        setSelection((prev) => ({
            connectionIds: addToSelection ? prev.connectionIds : [],
            blockIds: addToSelection
                ? prev.blockIds.includes(id)
                    ? prev.blockIds.filter((bid) => bid !== id)
                    : [...prev.blockIds, id]
                : [id],
        }));
    }, []);

    // Select connection
    const selectConnection = useCallback((id: string, addToSelection = false) => {
        setSelection((prev) => ({
            blockIds: addToSelection ? prev.blockIds : [],
            connectionIds: addToSelection
                ? prev.connectionIds.includes(id)
                    ? prev.connectionIds.filter((cid) => cid !== id)
                    : [...prev.connectionIds, id]
                : [id],
        }));
    }, []);

    // Clear selection
    const clearSelection = useCallback(() => {
        setSelection({ blockIds: [], connectionIds: [] });
    }, []);

    // Delete selected items
    const deleteSelected = useCallback(() => {
        if (selection.blockIds.length === 0 && selection.connectionIds.length === 0) return;

        saveToHistory();

        // Delete blocks
        setBlocks((prev) =>
            prev.filter((b) => !selection.blockIds.includes(b.id))
        );

        // Delete connections (including ones connected to deleted blocks)
        setConnections((prev) =>
            prev.filter(
                (c) =>
                    !selection.connectionIds.includes(c.id) &&
                    !selection.blockIds.includes(c.fromBlockId) &&
                    !selection.blockIds.includes(c.toBlockId)
            )
        );

        clearSelection();
    }, [selection, saveToHistory, clearSelection]);

    // Undo
    const undo = useCallback(() => {
        if (historyIndexRef.current <= 0) return;

        historyIndexRef.current -= 1;
        const entry = historyRef.current[historyIndexRef.current];

        if (entry) {
            setBlocks(JSON.parse(JSON.stringify(entry.blocks)));
            setConnections(JSON.parse(JSON.stringify(entry.connections)));
        }
    }, []);

    // Redo
    const redo = useCallback(() => {
        if (historyIndexRef.current >= historyRef.current.length - 1) return;

        historyIndexRef.current += 1;
        const entry = historyRef.current[historyIndexRef.current];

        if (entry) {
            setBlocks(JSON.parse(JSON.stringify(entry.blocks)));
            setConnections(JSON.parse(JSON.stringify(entry.connections)));
        }
    }, []);

    // Reset canvas
    const resetCanvas = useCallback(() => {
        saveToHistory();
        setBlocks([]);
        setConnections([]);
        clearSelection();
    }, [saveToHistory, clearSelection]);

    return {
        blocks,
        connections,
        selection,
        hoveredBlockId,
        highlightedBlockId,
        addBlock,
        removeBlock,
        updateBlockPosition,
        updateBlockValue,
        addConnection,
        removeConnection,
        selectBlock,
        selectConnection,
        clearSelection,
        deleteSelected,
        setHoveredBlock: setHoveredBlockId,
        setHighlightedBlock: setHighlightedBlockId,
        undo,
        redo,
        canUndo: historyIndexRef.current > 0,
        canRedo: historyIndexRef.current < historyRef.current.length - 1,
        resetCanvas,
    };
};
