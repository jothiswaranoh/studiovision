import VisualCanvas from "../components/VisualCanvas";
import { BlockDefinition } from "../data/blockDefinitions";


interface CanvasManagerProps {
    blocks: any[];
    connections: any[];
    selection: any;
    hoveredBlockId: string | null;
    highlightedBlockId: string | null;
    onDropBlock: (definition: BlockDefinition, x: number, y: number) => void;
    onBlockSelect: (id: string, addToSelection?: boolean) => void;
    onBlockMove: (id: string, x: number, y: number) => void;
    onBlockHover: (id: string | null) => void;
    onBlockValueChange: (id: string, key: string, value: string) => void;
    onConnectionCreate: (fromBlockId: string, fromPortId: string, toBlockId: string, toPortId: string) => boolean;
    onConnectionRemove: (connectionId: string) => void;
    onCanvasClick: () => void;
    onDeleteSelected: () => void;
    onReset: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
}

export default function CanvasManager({
    blocks,
    connections,
    selection,
    hoveredBlockId,
    highlightedBlockId,
    onDropBlock,
    onBlockSelect,
    onBlockMove,
    onBlockHover,
    onBlockValueChange,
    onConnectionCreate,
    onConnectionRemove,
    onCanvasClick,
    onDeleteSelected,
    onReset,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
}: CanvasManagerProps) {
    return (
        <VisualCanvas
            blocks={blocks}
            connections={connections}
            selection={selection}
            hoveredBlockId={hoveredBlockId}
            highlightedBlockId={highlightedBlockId}
            onDropBlock={onDropBlock}
            onBlockSelect={onBlockSelect}
            onBlockMove={onBlockMove}
            onBlockHover={onBlockHover}
            onBlockValueChange={onBlockValueChange}
            onConnectionCreate={onConnectionCreate}
            onConnectionRemove={onConnectionRemove}
            onCanvasClick={onCanvasClick}
            onDeleteSelected={onDeleteSelected}
            onReset={onReset}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={onUndo}
            onRedo={onRedo}
        />
    );
}