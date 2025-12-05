import { useState, useRef, useCallback, useEffect } from 'react';
import { Stage, Layer, Group, Text, Line, Circle, Rect } from 'react-konva';
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
    Maximize2,
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
    onConnectionCreate: (
        fromBlockId: string,
        fromPortId: string,
        toBlockId: string,
        toPortId: string
    ) => boolean;
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

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Tool shortcuts
            if (e.key === 'v' || e.key === 'V') {
                setTool('select');
            } else if (e.key === 'h' || e.key === 'H') {
                setTool('pan');
            }
            // Delete selected
            else if ((e.key === 'Delete' || e.key === 'Backspace') && selection.blockIds.length > 0) {
                onDeleteSelected();
            }
            // Undo/Redo
            else if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z' && !e.shiftKey && canUndo) {
                    e.preventDefault();
                    onUndo();
                } else if ((e.key === 'Z' || (e.key === 'z' && e.shiftKey)) && canRedo) {
                    e.preventDefault();
                    onRedo();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selection, canUndo, canRedo, onUndo, onRedo, onDeleteSelected]);

    // Canvas drag & drop
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
                showToast.success(`Added ${block.name} block`);
            }
        } catch {
            showToast.error('Failed to add block');
        }
    };

    // Zoom handling
    const handleWheel = useCallback(
        (e: KonvaEventObject<WheelEvent>) => {
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
            const clampedScale = Math.max(0.25, Math.min(3, newScale));

            setScale(clampedScale);
            setPosition({
                x: pointer.x - mousePointTo.x * clampedScale,
                y: pointer.y - mousePointTo.y * clampedScale,
            });
        },
        [scale, position]
    );

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
            setMousePos({
                x: (pointer.x - position.x) / scale,
                y: (pointer.y - position.y) / scale
            });
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

        // Complete connection
        if (connectionStart && hoveredPortId) {
            const targetBlock = blocks.find((b) =>
                [...b.definition.inputs, ...b.definition.outputs].some((p) => p.id === hoveredPortId)
            );

            if (targetBlock) {
                const targetPort = [...targetBlock.definition.inputs, ...targetBlock.definition.outputs].find(
                    (p) => p.id === hoveredPortId
                );
                const sourceBlock = blocks.find((b) => b.id === connectionStart.blockId);
                const sourcePort = sourceBlock
                    ? [...sourceBlock.definition.inputs, ...sourceBlock.definition.outputs].find(
                        (p) => p.id === connectionStart.portId
                    )
                    : null;

                if (targetPort && sourcePort && sourceBlock) {
                    const validation = validateConnection(sourcePort, targetPort);

                    if (validation.isValid) {
                        const isSourceOutput = connectionStart.portType === 'output' || connectionStart.portType === 'flow-out';
                        const fromBlockId = isSourceOutput ? connectionStart.blockId : targetBlock.id;
                        const fromPortId = isSourceOutput ? connectionStart.portId : hoveredPortId;
                        const toBlockId = isSourceOutput ? targetBlock.id : connectionStart.blockId;
                        const toPortId = isSourceOutput ? hoveredPortId : connectionStart.portId;

                        const success = onConnectionCreate(fromBlockId, fromPortId, toBlockId, toPortId);
                        if (success) {
                            showToast.connection('Connection created');
                        } else {
                            showToast.error('Connection failed');
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

    // Reset view
    const handleResetView = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
        showToast.info('View reset');
    };

    // Block rendering
    const renderBlock = (block: CanvasBlock) => {
        const isSelected = selection.blockIds.includes(block.id);
        const isHovered = hoveredBlockId === block.id;
        const isHighlighted = highlightedBlockId === block.id;
        const categoryInfo = BLOCK_CATEGORIES[block.definition.category as BlockCategory];

        const glowIntensity = isHighlighted ? 30 : isSelected ? 20 : isHovered ? 15 : 0;

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
                {/* Shadow */}
                <Rect
                    x={4}
                    y={4}
                    width={block.width}
                    height={block.height}
                    cornerRadius={12}
                    fill="rgba(0, 0, 0, 0.4)"
                    opacity={0.6}
                />

                {/* Background */}
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
                    strokeWidth={isSelected || isHighlighted ? 3 : 1}
                    shadowColor={isHighlighted ? '#00FFFF' : categoryInfo.color}
                    shadowBlur={glowIntensity}
                    shadowOpacity={0.6}
                />

                {/* Header */}
                <Rect
                    width={block.width}
                    height={36}
                    cornerRadius={[12, 12, 0, 0]}
                    fill={categoryInfo.color}
                    opacity={0.25}
                />

                {/* Category Dot */}
                <Circle x={16} y={18} radius={6} fill={categoryInfo.color} />

                {/* Title */}
                <Text
                    x={30}
                    y={11}
                    text={block.definition.name}
                    fontSize={14}
                    fontFamily="Inter, system-ui, sans-serif"
                    fontStyle="600"
                    fill="#FFFFFF"
                />

                {/* Description */}
                <Text
                    x={12}
                    y={44}
                    text={block.definition.description}
                    fontSize={10}
                    fontFamily="Inter, system-ui, sans-serif"
                    fill="rgba(255, 255, 255, 0.5)"
                    width={block.width - 24}
                    wrap="word"
                />

                {/* Input Ports */}
                {block.definition.inputs.map((port, index) => {
                    const portY = 70 + index * 28;
                    const isPortHovered = hoveredPortId === port.id;
                    const portColor = getDataTypeColor(port.dataType);
                    const isValidTarget =
                        connectionStart &&
                        (connectionStart.portType === 'output' || connectionStart.portType === 'flow-out') &&
                        validateConnection(
                            blocks
                                .find((b) => b.id === connectionStart.blockId)
                                ?.definition.outputs.find((p) => p.id === connectionStart.portId)!,
                            port
                        ).isValid;

                    return (
                        <Group key={port.id}>
                            {/* Hover ring */}
                            {(isPortHovered || (connectionStart && isValidTarget)) && (
                                <Circle
                                    x={0}
                                    y={portY}
                                    radius={11}
                                    fill={isValidTarget ? '#00FF88' : '#00FFFF'}
                                    opacity={0.3}
                                />
                            )}
                            {/* Port */}
                            <Circle
                                x={0}
                                y={portY}
                                radius={7}
                                fill={portColor}
                                stroke={isPortHovered ? '#FFFFFF' : '#000000'}
                                strokeWidth={isPortHovered ? 2.5 : 1.5}
                                onMouseDown={(e) => {
                                    e.cancelBubble = true;
                                    setConnectionStart({
                                        blockId: block.id,
                                        portId: port.id,
                                        portType: port.type === 'flow-in' ? 'flow-in' : 'input',
                                        dataType: port.dataType,
                                    });
                                }}
                                onMouseEnter={() => setHoveredPortId(port.id)}
                                onMouseLeave={() => setHoveredPortId(null)}
                            />
                            <Text
                                x={14}
                                y={portY - 6}
                                text={port.label}
                                fontSize={11}
                                fontFamily="Inter, system-ui, sans-serif"
                                fill="rgba(255, 255, 255, 0.7)"
                            />
                        </Group>
                    );
                })}

                {/* Output Ports */}
                {block.definition.outputs.map((port, index) => {
                    const portY = 70 + index * 28;
                    const isPortHovered = hoveredPortId === port.id;
                    const portColor = getDataTypeColor(port.dataType);
                    const isValidTarget =
                        connectionStart &&
                        (connectionStart.portType === 'input' || connectionStart.portType === 'flow-in') &&
                        validateConnection(
                            port,
                            blocks
                                .find((b) => b.id === connectionStart.blockId)
                                ?.definition.inputs.find((p) => p.id === connectionStart.portId)!
                        ).isValid;

                    return (
                        <Group key={port.id}>
                            {/* Hover ring */}
                            {(isPortHovered || (connectionStart && isValidTarget)) && (
                                <Circle
                                    x={block.width}
                                    y={portY}
                                    radius={11}
                                    fill={isValidTarget ? '#00FF88' : '#00FFFF'}
                                    opacity={0.3}
                                />
                            )}
                            {/* Port */}
                            <Circle
                                x={block.width}
                                y={portY}
                                radius={7}
                                fill={portColor}
                                stroke={isPortHovered ? '#FFFFFF' : '#000000'}
                                strokeWidth={isPortHovered ? 2.5 : 1.5}
                                onMouseDown={(e) => {
                                    e.cancelBubble = true;
                                    setConnectionStart({
                                        blockId: block.id,
                                        portId: port.id,
                                        portType: port.type === 'flow-out' ? 'flow-out' : 'output',
                                        dataType: port.dataType,
                                    });
                                }}
                                onMouseEnter={() => setHoveredPortId(port.id)}
                                onMouseLeave={() => setHoveredPortId(null)}
                            />
                            <Text
                                x={block.width - 60}
                                y={portY - 6}
                                text={port.label}
                                fontSize={11}
                                fontFamily="Inter, system-ui, sans-serif"
                                fill="rgba(255, 255, 255, 0.7)"
                                align="right"
                                width={50}
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

        const fromPortIndex = fromBlock.definition.outputs.findIndex(
            (p) => p.id === connection.fromPortId
        );
        const toPortIndex = toBlock.definition.inputs.findIndex((p) => p.id === connection.toPortId);

        if (fromPortIndex === -1 || toPortIndex === -1) return null;

        const startX = fromBlock.x + fromBlock.width;
        const startY = fromBlock.y + 70 + fromPortIndex * 28;
        const endX = toBlock.x;
        const endY = toBlock.y + 70 + toPortIndex * 28;

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
                strokeWidth={2.5}
                opacity={0.8}
                lineCap="round"
                shadowColor="#00FFFF"
                shadowBlur={10}
                shadowOpacity={0.6}
            />
        );
    };

    // Temporary connection
    const renderTempConnection = () => {
        if (!connectionStart) return null;

        const fromBlock = blocks.find((b) => b.id === connectionStart.blockId);
        if (!fromBlock) return null;

        const isOutput = connectionStart.portType === 'output' || connectionStart.portType === 'flow-out';
        const portIndex = isOutput
            ? fromBlock.definition.outputs.findIndex((p) => p.id === connectionStart.portId)
            : fromBlock.definition.inputs.findIndex((p) => p.id === connectionStart.portId);

        if (portIndex === -1) return null;

        const startX = isOutput ? fromBlock.x + fromBlock.width : fromBlock.x;
        const startY = fromBlock.y + 70 + portIndex * 28;

        let isValid = true;
        if (hoveredPortId) {
            const targetBlock = blocks.find((b) =>
                [...b.definition.inputs, ...b.definition.outputs].some((p) => p.id === hoveredPortId)
            );
            if (targetBlock) {
                const targetPort = [...targetBlock.definition.inputs, ...targetBlock.definition.outputs].find(
                    (p) => p.id === hoveredPortId
                );
                const sourcePort = [...fromBlock.definition.inputs, ...fromBlock.definition.outputs].find(
                    (p) => p.id === connectionStart.portId
                );
                if (targetPort && sourcePort) {
                    isValid = validateConnection(sourcePort, targetPort).isValid;
                }
            }
        }

        return (
            <Line
                points={[startX, startY, mousePos.x, mousePos.y]}
                stroke={isValid ? '#00FFFF' : '#FF0055'}
                strokeWidth={2.5}
                opacity={0.7}
                dash={[8, 6]}
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
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1 p-1 rounded-lg glass-effect border border-white/10 shadow-xl">
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
                    onClick={() => setScale((s) => Math.min(3, s * 1.2))}
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
                <span className="px-2 text-xs text-white/40 font-mono min-w-[50px] text-center">
                    {Math.round(scale * 100)}%
                </span>
                <button
                    onClick={handleResetView}
                    className="p-2 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                    title="Reset View"
                >
                    <Maximize2 size={18} />
                </button>
                <div className="w-px h-6 bg-white/20 mx-1" />
                <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    className={`p-2 rounded-md transition-all duration-200 ${canUndo
                            ? 'text-white/60 hover:text-white hover:bg-white/10'
                            : 'text-white/20 cursor-not-allowed'
                        }`}
                    title="Undo (Ctrl+Z)"
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
                    title="Redo (Ctrl+Shift+Z)"
                >
                    <Redo2 size={18} />
                </button>
                <div className="w-px h-6 bg-white/20 mx-1" />
                <button
                    onClick={onDeleteSelected}
                    disabled={selection.blockIds.length === 0}
                    className={`p-2 rounded-md transition-all duration-200 ${selection.blockIds.length > 0
                            ? 'text-white/60 hover:text-error hover:bg-error/10'
                            : 'text-white/20 cursor-not-allowed'
                        }`}
                    title="Delete Selected (Del)"
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

            {/* Grid Background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)
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
                style={{ cursor: tool === 'pan' || isDragging ? 'grabbing' : 'default' }}
            >
                <Layer>
                    {connections.map(renderConnection)}
                    {renderTempConnection()}
                    {blocks.map(renderBlock)}
                </Layer>
            </Stage>

            {/* Empty State */}
            {blocks.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl glass-effect flex items-center justify-center border border-white/10">
                            <div className="w-16 h-16 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center">
                                <span className="text-3xl text-white/20 font-light">+</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-white/70 mb-3">
                            Start Building
                        </h3>
                        <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed">
                            Drag blocks from the library to create your visual program.
                            <br />
                            Connect blocks to define the flow of your application.
                        </p>
                    </div>
                </div>
            )}

            {/* Stats Footer */}
            <div className="absolute bottom-4 right-4 z-10 px-3 py-2 rounded-lg glass-effect border border-white/10 text-xs text-white/40 flex items-center gap-4">
                <span>{blocks.length} blocks</span>
                <span>{connections.length} connections</span>
                {selection.blockIds.length > 0 && (
                    <span className="text-neon-cyan">{selection.blockIds.length} selected</span>
                )}
            </div>
        </div>
    );
}