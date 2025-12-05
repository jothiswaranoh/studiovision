import { useState, useRef, useCallback, useEffect } from 'react';
import { Stage, Layer, Rect, Group, Text, Line, Circle } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import {
    MousePointer,
    Hand,
    ZoomIn,
    ZoomOut,
    Undo2,
    Redo2,
    Trash2,
    RotateCcw,
} from 'lucide-react';
import { CanvasBlock, Connection, Selection } from '../hooks/useBlocks';
import { BlockDefinition, BLOCK_CATEGORIES, BlockCategory } from '../data/blockDefinitions';
import { validateConnection, getDataTypeColor, DragConnectionState } from '../types/connection';
import showToast from '../components/Toast';

interface VisualCanvasProps {
    blocks: CanvasBlock[];
    connections: Connection[];
    selection: Selection;
    hoveredBlockId: string | null;
    highlightedBlockId: string | null;
    onDropBlock: (definition: BlockDefinition, x: number, y: number) => void;
    onBlockSelect: (id: string, addToSelection?: boolean) => void;
    onBlockMove: (id: string, x: number, y: number) => void;
    onBlockHover: (id: string | null) => void;
    onBlockValueChange: (id: string, key: string, value: string) => void;
    onConnectionCreate: (fromBlockId: string, fromPortId: string, toBlockId: string, toPortId: string) => boolean;
    onConnectionRemove: (id: string) => void;
    onCanvasClick: () => void;
    onDeleteSelected: () => void;
    onReset: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
}

type Tool = 'select' | 'pan';

export default function VisualCanvas({
    blocks,
    connections,
    selection,
    hoveredBlockId,
    highlightedBlockId,
    onDropBlock,
    onBlockSelect,
    onBlockMove,
    onBlockHover,
    onConnectionCreate,
    onCanvasClick,
    onDeleteSelected,
    onReset,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
}: VisualCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [tool, setTool] = useState<Tool>('select');
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [connectionStart, setConnectionStart] = useState<DragConnectionState | null>(null);
    const [hoveredPortId, setHoveredPortId] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Resize handling
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Handle canvas drag & drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('application/json');
        if (!data) return;

        try {
            const block = JSON.parse(data) as BlockDefinition;
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                const x = (e.clientX - rect.left - position.x) / scale;
                const y = (e.clientY - rect.top - position.y) / scale;
                onDropBlock(block, x, y);
            }
        } catch {
            console.error('Failed to parse dropped block data');
        }
    };

    // Zoom handling
    const handleWheel = useCallback((e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const scaleBy = 1.1;
        const stage = e.target.getStage();
        if (!stage) return;

        const oldScale = scale;
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const mousePointTo = {
            x: (pointer.x - position.x) / oldScale,
            y: (pointer.y - position.y) / oldScale,
        };

        const direction = e.evt.deltaY > 0 ? -1 : 1;
        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        const clampedScale = Math.max(0.25, Math.min(2, newScale));

        setScale(clampedScale);
        setPosition({
            x: pointer.x - mousePointTo.x * clampedScale,
            y: pointer.y - mousePointTo.y * clampedScale,
        });
    }, [scale, position]);

    // Pan handling
    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (tool === 'pan' || e.evt.button === 1) {
            setIsDragging(true);
            setDragStart({ x: e.evt.clientX - position.x, y: e.evt.clientY - position.y });
        } else if (e.target === e.target.getStage()) {
            onCanvasClick();
        }
    };

    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        const pointer = stage?.getPointerPosition();
        if (pointer) {
            setMousePos({ x: (pointer.x - position.x) / scale, y: (pointer.y - position.y) / scale });
        }

        if (isDragging) {
            setPosition({
                x: e.evt.clientX - dragStart.x,
                y: e.evt.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);

        // Complete connection if we have a start and are hovering over a valid port
        if (connectionStart && hoveredPortId) {
            const targetBlock = blocks.find(b =>
                b.definition.inputs.some(p => p.id === hoveredPortId) ||
                b.definition.outputs.some(p => p.id === hoveredPortId)
            );

            if (targetBlock) {
                const targetPort = [...targetBlock.definition.inputs, ...targetBlock.definition.outputs]
                    .find(p => p.id === hoveredPortId);
                const sourceBlock = blocks.find(b => b.id === connectionStart.blockId);
                const sourcePort = sourceBlock ?
                    [...sourceBlock.definition.inputs, ...sourceBlock.definition.outputs]
                        .find(p => p.id === connectionStart.portId) : null;

                if (targetPort && sourcePort && sourceBlock) {
                    // Validate connection
                    const validation = validateConnection(sourcePort, targetPort);

                    if (validation.isValid) {
                        // Determine which is input and which is output
                        const isSourceOutput = connectionStart.portType === 'output';
                        const fromBlockId = isSourceOutput ? connectionStart.blockId : targetBlock.id;
                        const fromPortId = isSourceOutput ? connectionStart.portId : hoveredPortId;
                        const toBlockId = isSourceOutput ? targetBlock.id : connectionStart.blockId;
                        const toPortId = isSourceOutput ? hoveredPortId : connectionStart.portId;

                        const success = onConnectionCreate(fromBlockId, fromPortId, toBlockId, toPortId);
                        if (success) {
                            showToast.connection('Connection created successfully');
                        } else {
                            showToast.error('Failed to create connection');
                        }
                    } else {
                        showToast.error(validation.reason || 'Invalid connection');
                    }
                }
            }
        }

        setConnectionStart(null);
        setHoveredPortId(null);
    };

    // Block rendering
    const renderBlock = (block: CanvasBlock) => {
        const isSelected = selection.blockIds.includes(block.id);
        const isHovered = hoveredBlockId === block.id;
        const isHighlighted = highlightedBlockId === block.id;
        const categoryInfo = BLOCK_CATEGORIES[block.definition.category as BlockCategory];

        return (
            <Group
                key={block.id}
                x={block.x}
                y={block.y}
                draggable={tool === 'select'}
                onClick={(e) => {
                    e.cancelBubble = true;
                    onBlockSelect(block.id, e.evt.shiftKey);
                }}
                onDragStart={() => onBlockSelect(block.id)}
                onDragEnd={(e) => {
                    onBlockMove(block.id, e.target.x(), e.target.y());
                }}
                onMouseEnter={() => onBlockHover(block.id)}
                onMouseLeave={() => onBlockHover(null)}
            >
                {/* Block Shadow */}
                <Rect
                    x={4}
                    y={4}
                    width={block.width}
                    height={block.height}
                    cornerRadius={12}
                    fill="rgba(0, 0, 0, 0.3)"
                />

                {/* Block Background */}
                <Rect
                    width={block.width}
                    height={block.height}
                    cornerRadius={12}
                    fill="#1A1A2E"
                    stroke={
                        isHighlighted
                            ? '#00FFFF'
                            : isSelected
                                ? categoryInfo.color
                                : isHovered
                                    ? `${categoryInfo.color}80`
                                    : 'rgba(255, 255, 255, 0.1)'
                    }
                    strokeWidth={isSelected || isHighlighted ? 2 : 1}
                    shadowColor={isHighlighted ? '#00FFFF' : categoryInfo.color}
                    shadowBlur={isSelected || isHighlighted ? 20 : 0}
                    shadowOpacity={0.5}
                />

                {/* Block Header */}
                <Rect
                    width={block.width}
                    height={32}
                    cornerRadius={[12, 12, 0, 0]}
                    fill={categoryInfo.color}
                    opacity={0.3}
                />

                {/* Category Indicator */}
                <Circle
                    x={16}
                    y={16}
                    radius={5}
                    fill={categoryInfo.color}
                />

                {/* Block Title */}
                <Text
                    x={28}
                    y={10}
                    text={block.definition.name}
                    fontSize={13}
                    fontFamily="Inter, system-ui, sans-serif"
                    fontStyle="600"
                    fill="#FFFFFF"
                />

                {/* Block Type */}
                <Text
                    x={12}
                    y={40}
                    text={block.definition.description}
                    fontSize={10}
                    fontFamily="Inter, system-ui, sans-serif"
                    fill="rgba(255, 255, 255, 0.5)"
                    width={block.width - 24}
                    wrap="word"
                />

                {/* Input Ports */}
                {block.definition.inputs.map((port, index) => {
                    const isHovered = hoveredPortId === port.id;
                    const portColor = getDataTypeColor(port.dataType);
                    const isValidTarget = connectionStart && connectionStart.portType === 'output' &&
                        validateConnection(
                            blocks.find(b => b.id === connectionStart.blockId)?.definition.outputs.find(p => p.id === connectionStart.portId)!,
                            port
                        ).isValid;

                    return (
                        <Group key={port.id}>
                            {/* Port highlight ring */}
                            {(isHovered || (connectionStart && isValidTarget)) && (
                                <Circle
                                    x={0}
                                    y={60 + index * 24}
                                    radius={10}
                                    fill={isValidTarget ? '#00FF88' : '#00FFFF'}
                                    opacity={0.3}
                                />
                            )}
                            <Circle
                                x={0}
                                y={60 + index * 24}
                                radius={6}
                                fill={portColor}
                                stroke={isHovered ? '#FFFFFF' : '#000'}
                                strokeWidth={isHovered ? 2 : 1}
                                onMouseDown={(e) => {
                                    e.cancelBubble = true;
                                    setConnectionStart({
                                        blockId: block.id,
                                        portId: port.id,
                                        portType: 'input',
                                        dataType: port.dataType
                                    });
                                }}
                                onMouseEnter={() => setHoveredPortId(port.id)}
                                onMouseLeave={() => setHoveredPortId(null)}
                            />
                            <Text
                                x={12}
                                y={54 + index * 24}
                                text={port.label}
                                fontSize={10}
                                fill="rgba(255, 255, 255, 0.6)"
                            />
                        </Group>
                    );
                })}

                {/* Output Ports */}
                {block.definition.outputs.map((port, index) => {
                    const isHovered = hoveredPortId === port.id;
                    const portColor = getDataTypeColor(port.dataType);
                    const isValidTarget = connectionStart && connectionStart.portType === 'input' &&
                        validateConnection(
                            port,
                            blocks.find(b => b.id === connectionStart.blockId)?.definition.inputs.find(p => p.id === connectionStart.portId)!
                        ).isValid;

                    return (
                        <Group key={port.id}>
                            {/* Port highlight ring */}
                            {(isHovered || (connectionStart && isValidTarget)) && (
                                <Circle
                                    x={block.width}
                                    y={60 + index * 24}
                                    radius={10}
                                    fill={isValidTarget ? '#00FF88' : '#00FFFF'}
                                    opacity={0.3}
                                />
                            )}
                            <Circle
                                x={block.width}
                                y={60 + index * 24}
                                radius={6}
                                fill={portColor}
                                stroke={isHovered ? '#FFFFFF' : '#000'}
                                strokeWidth={isHovered ? 2 : 1}
                                onMouseDown={(e) => {
                                    e.cancelBubble = true;
                                    setConnectionStart({
                                        blockId: block.id,
                                        portId: port.id,
                                        portType: 'output',
                                        dataType: port.dataType
                                    });
                                }}
                                onMouseEnter={() => setHoveredPortId(port.id)}
                                onMouseLeave={() => setHoveredPortId(null)}
                            />
                            <Text
                                x={block.width - 50}
                                y={54 + index * 24}
                                text={port.label}
                                fontSize={10}
                                fill="rgba(255, 255, 255, 0.6)"
                                align="right"
                                width={40}
                            />
                        </Group>
                    );
                })}
            </Group>
        );
    };

    // Connection rendering
    const renderConnection = (connection: Connection) => {
        const fromBlock = blocks.find((b) => b.id === connection.fromBlockId);
        const toBlock = blocks.find((b) => b.id === connection.toBlockId);
        if (!fromBlock || !toBlock) return null;

        const fromPortIndex = fromBlock.definition.outputs.findIndex((p) => p.id === connection.fromPortId);
        const toPortIndex = toBlock.definition.inputs.findIndex((p) => p.id === connection.toPortId);

        const startX = fromBlock.x + fromBlock.width;
        const startY = fromBlock.y + 60 + fromPortIndex * 24;
        const endX = toBlock.x;
        const endY = toBlock.y + 60 + toPortIndex * 24;

        // Calculate control points for bezier curve
        const controlOffset = Math.min(Math.abs(endX - startX) / 2, 100);

        return (
            <Line
                key={connection.id}
                points={[
                    startX,
                    startY,
                    startX + controlOffset,
                    startY,
                    endX - controlOffset,
                    endY,
                    endX,
                    endY,
                ]}
                bezier
                stroke="#00FFFF"
                strokeWidth={2}
                opacity={0.8}
                lineCap="round"
                shadowColor="#00FFFF"
                shadowBlur={8}
                shadowOpacity={0.5}
            />
        );
    };

    // Temporary connection line while dragging
    const renderTempConnection = () => {
        if (!connectionStart) return null;

        const fromBlock = blocks.find((b) => b.id === connectionStart.blockId);
        if (!fromBlock) return null;

        const isOutput = connectionStart.portType === 'output';
        const portIndex = isOutput
            ? fromBlock.definition.outputs.findIndex((p) => p.id === connectionStart.portId)
            : fromBlock.definition.inputs.findIndex((p) => p.id === connectionStart.portId);

        const startX = isOutput ? fromBlock.x + fromBlock.width : fromBlock.x;
        const startY = fromBlock.y + 60 + portIndex * 24;

        // Check if hovering over a valid target port
        let isValid = true;
        if (hoveredPortId) {
            const targetBlock = blocks.find(b =>
                b.definition.inputs.some(p => p.id === hoveredPortId) ||
                b.definition.outputs.some(p => p.id === hoveredPortId)
            );
            if (targetBlock) {
                const targetPort = [...targetBlock.definition.inputs, ...targetBlock.definition.outputs]
                    .find(p => p.id === hoveredPortId);
                const sourcePort = [...fromBlock.definition.inputs, ...fromBlock.definition.outputs]
                    .find(p => p.id === connectionStart.portId);
                if (targetPort && sourcePort) {
                    isValid = validateConnection(sourcePort, targetPort).isValid;
                }
            }
        }

        return (
            <Line
                points={[startX, startY, mousePos.x, mousePos.y]}
                stroke={isValid ? '#00FFFF' : '#FF0055'}
                strokeWidth={2}
                opacity={0.6}
                dash={[5, 5]}
                lineCap="round"
            />
        );
    };

    return (
        <div
            ref={containerRef}
            className="flex-1 bg-void relative overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* Toolbar */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1 p-1 rounded-lg glass-effect border border-white/10">
                <button
                    onClick={() => setTool('select')}
                    className={`p-2 rounded-md transition-all duration-200 ${tool === 'select'
                        ? 'bg-neon-cyan/20 text-neon-cyan'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                    title="Select Tool (V)"
                >
                    <MousePointer size={18} />
                </button>
                <button
                    onClick={() => setTool('pan')}
                    className={`p-2 rounded-md transition-all duration-200 ${tool === 'pan'
                        ? 'bg-neon-cyan/20 text-neon-cyan'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                    title="Pan Tool (H)"
                >
                    <Hand size={18} />
                </button>
                <div className="w-px h-6 bg-white/20 mx-1" />
                <button
                    onClick={() => setScale((s) => Math.min(2, s * 1.2))}
                    className="p-2 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                    title="Zoom In"
                >
                    <ZoomIn size={18} />
                </button>
                <button
                    onClick={() => setScale((s) => Math.max(0.25, s / 1.2))}
                    className="p-2 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                    title="Zoom Out"
                >
                    <ZoomOut size={18} />
                </button>
                <span className="px-2 text-xs text-white/40 font-mono">
                    {Math.round(scale * 100)}%
                </span>
                <div className="w-px h-6 bg-white/20 mx-1" />
                <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    className={`p-2 rounded-md transition-all duration-200 ${canUndo
                        ? 'text-white/60 hover:text-white hover:bg-white/10'
                        : 'text-white/20 cursor-not-allowed'
                        }`}
                    title="Undo"
                >
                    <Undo2 size={18} />
                </button>
                <button
                    onClick={onRedo}
                    disabled={!canRedo}
                    className={`p-2 rounded-md transition-all duration-200 ${canRedo
                        ? 'text-white/60 hover:text-white hover:bg-white/10'
                        : 'text-white/20 cursor-not-allowed'
                        }`}
                    title="Redo"
                >
                    <Redo2 size={18} />
                </button>
                <div className="w-px h-6 bg-white/20 mx-1" />
                <button
                    onClick={onDeleteSelected}
                    className="p-2 rounded-md text-white/60 hover:text-error hover:bg-error/10 transition-all duration-200"
                    title="Delete Selected"
                >
                    <Trash2 size={18} />
                </button>
                <button
                    onClick={onReset}
                    className="p-2 rounded-md text-white/60 hover:text-warning hover:bg-warning/10 transition-all duration-200"
                    title="Reset Canvas"
                >
                    <RotateCcw size={18} />
                </button>
            </div>

            {/* Grid Background Pattern */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.02) 1px, transparent 1px)
          `,
                    backgroundSize: `${20 * scale}px ${20 * scale}px`,
                    backgroundPosition: `${position.x}px ${position.y}px`,
                }}
            />

            {/* Konva Stage */}
            <Stage
                width={dimensions.width}
                height={dimensions.height}
                scaleX={scale}
                scaleY={scale}
                x={position.x}
                y={position.y}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ cursor: tool === 'pan' || isDragging ? 'grab' : 'default' }}
            >
                <Layer>
                    {/* Connections */}
                    {connections.map(renderConnection)}

                    {/* Temporary Connection */}
                    {renderTempConnection()}

                    {/* Blocks */}
                    {blocks.map(renderBlock)}
                </Layer>
            </Stage>

            {/* Empty State */}
            {blocks.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl glass-effect flex items-center justify-center">
                            <div className="w-12 h-12 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center">
                                <span className="text-2xl text-white/20">+</span>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-white/60 mb-2">
                            Drop blocks here
                        </h3>
                        <p className="text-sm text-white/40 max-w-xs">
                            Drag blocks from the library to start building your visual program
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
