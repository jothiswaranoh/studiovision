
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Database, Key, Share2, ZoomIn, ZoomOut, Maximize, Filter,
  GitMerge, ListFilter, ArrowRightCircle, Plus, Trash2,
  Heading, Layers, Code2, Scissors, Save, Shield,
  ChevronRight, ChevronDown, FunctionSquare
} from 'lucide-react';
import { VisualFlow, FlowchartNode, FlowchartEdge, MockDatabase } from '../types';

interface VisualizerCanvasProps {
  visualFlow?: VisualFlow;
  isLoading: boolean;
  onFlowChange?: (newFlow: VisualFlow) => void;
  mockDb?: MockDatabase;
}

interface NodeProps {
  node: FlowchartNode;
  style: React.CSSProperties;
  isSelected?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onDelete?: () => void;
  onRemoveColumn?: (index: number) => void;
}

// --- Node Components ---

const TableNodeComponent: React.FC<NodeProps> = ({ node, style, isSelected, onMouseDown, onDelete }) => (
  <div
    className={`absolute w-56 bg-slate-900 border rounded-lg shadow-2xl flex flex-col transition-all duration-200 group cursor-grab active:cursor-grabbing z-10 
      ${isSelected ? 'border-blue-400 ring-2 ring-blue-500/20' : 'border-slate-600 hover:border-blue-500 hover:shadow-blue-500/20'}
    `}
    style={style}
    onMouseDown={onMouseDown}
  >
    <div className="h-9 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 px-3 flex items-center justify-between rounded-t-lg select-none">
      <div className="flex items-center gap-2">
        <Database className="w-3.5 h-3.5 text-blue-400" />
        <span className="font-bold text-slate-200 text-xs truncate max-w-[120px]" title={node.label}>{node.label}</span>
      </div>
      <div className="flex items-center gap-2">
        {isSelected && onDelete && (
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-red-400 hover:text-red-300">
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
    <div className="p-1 space-y-0.5 select-none max-h-[180px] overflow-y-auto custom-scrollbar bg-slate-950/30">
      {node.columns?.length ? node.columns.map((col, idx) => (
        <div key={idx} className="flex items-center justify-between text-[10px] px-2 py-1 rounded hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-1.5">
            {col.isPrimary && <Key className="w-2.5 h-2.5 text-amber-400" />}
            {col.isForeign && <Share2 className="w-2.5 h-2.5 text-purple-400" />}
            <span className="text-slate-300">{col.name}</span>
          </div>
          <span className="text-slate-500 font-mono text-[9px]">{col.type}</span>
        </div>
      )) : (
        <div className="text-[10px] text-slate-500 italic p-2 text-center">No columns</div>
      )}
    </div>
  </div>
);

const OperationNodeComponent: React.FC<NodeProps> = ({ node, style, isSelected, onMouseDown, onDelete, onRemoveColumn }) => {
  let bgColor = 'bg-slate-800';
  let borderColor = 'border-slate-600';
  let Icon = ArrowRightCircle;
  let typeLabel = node.type;

  switch (node.type.toUpperCase()) {
    case 'SELECT':
      bgColor = 'bg-emerald-900/90'; borderColor = 'border-emerald-500/50'; Icon = ListFilter; break;
    case 'WHERE':
    case 'HAVING':
      bgColor = 'bg-amber-900/90'; borderColor = 'border-amber-500/50'; Icon = Filter; break;
    case 'JOIN':
    case 'LEFT JOIN':
    case 'RIGHT JOIN':
    case 'INNER JOIN':
    case 'FULL JOIN':
    case 'CROSS JOIN':
      bgColor = 'bg-purple-900/90'; borderColor = 'border-purple-500/50'; Icon = GitMerge; break;
    case 'GROUP BY':
    case 'ORDER BY':
      bgColor = 'bg-indigo-900/90'; borderColor = 'border-indigo-500/50'; Icon = Heading; break;
    case 'UPDATE':
    case 'INSERT':
    case 'DELETE':
      bgColor = 'bg-rose-900/90'; borderColor = 'border-rose-500/50'; Icon = Scissors; break;
    case 'CTE':
    case 'SUBQUERY':
      bgColor = 'bg-cyan-900/90'; borderColor = 'border-cyan-500/50'; Icon = Layers; break;
    case 'CREATE':
    case 'ALTER':
    case 'DROP':
      bgColor = 'bg-orange-900/90'; borderColor = 'border-orange-500/50'; Icon = Code2; break;
    case 'GRANT':
    case 'REVOKE':
      bgColor = 'bg-yellow-900/90'; borderColor = 'border-yellow-500/50'; Icon = Shield; break;
    case 'COMMIT':
    case 'ROLLBACK':
      bgColor = 'bg-teal-900/90'; borderColor = 'border-teal-500/50'; Icon = Save; break;
  }

  const droppedColumns = node.data?.columns || [];

  return (
    <div
      className={`absolute px-3 py-2 rounded-md border shadow-lg flex flex-col gap-2 transition-all duration-200 cursor-grab active:cursor-grabbing z-20 
        ${bgColor} ${isSelected ? 'ring-2 ring-white/30 scale-105' : borderColor}
      `}
      style={{ ...style, minWidth: '140px' }}
      onMouseDown={onMouseDown}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={`p-1 rounded bg-black/20`}>
            <Icon className="w-3.5 h-3.5 text-white/90" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/50">{typeLabel}</span>
            <span className="text-xs font-medium text-white max-w-[140px] truncate" title={node.label}>
              {node.label}
            </span>
          </div>
        </div>
        {isSelected && onDelete && (
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-0.5 hover:bg-black/20 rounded text-white/60 hover:text-white">
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Dropped Columns View */}
      {droppedColumns.length > 0 && (
        <div className="mt-1 pt-2 border-t border-white/10 space-y-1">
          {droppedColumns.map((c: any, i: number) => (
            <div key={i} className="text-[10px] bg-black/30 rounded px-1.5 py-0.5 flex items-center justify-between group/col gap-2">
              <div className="flex items-center gap-1 overflow-hidden">
                {c.logic && <span className="text-amber-400 font-bold text-[9px]">{c.logic}</span>}
                <span className="text-slate-300 truncate">{c.table ? `${c.table}.` : ''}{c.column}</span>
                {c.operator && <span className="text-teal-400 font-mono text-[9px]">{c.operator}</span>}
                {c.value && <span className="text-teal-200 truncate max-w-[50px] font-mono text-[9px]">{c.value}</span>}
              </div>
              <button
                className="text-white/20 hover:text-red-400 opacity-0 group-hover/col:opacity-100 transition-opacity"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  if (onRemoveColumn) onRemoveColumn(i);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Edges ---

const ConnectionLine: React.FC<{
  edge?: FlowchartEdge;
  start?: { x: number, y: number };
  end?: { x: number, y: number };
  onClick?: (e: React.MouseEvent) => void;
  selected?: boolean;
}> = ({ start, end, onClick, selected }) => {
  if (!start || !end) return null;

  const startX = start.x + 100; // Approx width offset
  const startY = start.y + 25;
  const endX = end.x; // Enter left
  const endY = end.y + 25;

  const dist = Math.abs(endX - startX) * 0.5;
  const c1x = startX + dist;
  const c1y = startY;
  const c2x = endX - dist;
  const c2y = endY;

  const path = `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`;

  return (
    <g onClick={onClick} className="cursor-pointer group">
      {/* Hit area */}
      <path d={path} stroke="transparent" strokeWidth="15" fill="none" />
      {/* Background line */}
      <path d={path} stroke="#1e293b" strokeWidth="6" fill="none" />
      {/* Visible line */}
      <path
        d={path}
        stroke={selected ? "#60a5fa" : "#475569"}
        strokeWidth={selected ? "3" : "2"}
        fill="none"
        markerEnd={selected ? "url(#arrowhead-selected)" : "url(#arrowhead)"}
        className="transition-colors duration-300"
      />
    </g>
  );
};

// --- Sidebar ---

const TOOL_GROUPS = [
  {
    name: 'DML',
    items: [
      { type: 'SELECT', label: 'SELECT', icon: ListFilter },
      { type: 'INSERT', label: 'INSERT', icon: Plus },
      { type: 'UPDATE', label: 'UPDATE', icon: Scissors },
      { type: 'DELETE', label: 'DELETE', icon: Trash2 },
    ]
  },
  {
    name: 'Clauses',
    items: [
      { type: 'WHERE', label: 'WHERE', icon: Filter },
      { type: 'GROUP BY', label: 'GROUP BY', icon: Heading },
      { type: 'HAVING', label: 'HAVING', icon: Filter },
      { type: 'ORDER BY', label: 'ORDER BY', icon: Heading },
    ]
  },
  {
    name: 'Joins',
    items: [
      { type: 'INNER JOIN', label: 'INNER JOIN', icon: GitMerge },
      { type: 'LEFT JOIN', label: 'LEFT JOIN', icon: GitMerge },
      { type: 'RIGHT JOIN', label: 'RIGHT JOIN', icon: GitMerge },
      { type: 'FULL JOIN', label: 'FULL JOIN', icon: GitMerge },
    ]
  },
  {
    name: 'Functions',
    items: [
      { type: 'COUNT', label: 'COUNT', icon: FunctionSquare },
      { type: 'SUM', label: 'SUM', icon: FunctionSquare },
      { type: 'AVG', label: 'AVG', icon: FunctionSquare },
      { type: 'MIN', label: 'MIN', icon: FunctionSquare },
      { type: 'MAX', label: 'MAX', icon: FunctionSquare },
    ]
  },
  {
    name: 'Advanced',
    items: [
      { type: 'CTE', label: 'CTE', icon: Layers },
      { type: 'SUBQUERY', label: 'SUBQUERY', icon: Layers },
    ]
  },
  {
    name: 'DDL/Other',
    items: [
      { type: 'CREATE', label: 'CREATE', icon: Code2 },
      { type: 'DROP', label: 'DROP', icon: Trash2 },
      { type: 'COMMIT', label: 'COMMIT', icon: Save },
    ]
  }
];

export const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({ visualFlow, onFlowChange, mockDb }) => {
  const [nodes, setNodes] = useState<FlowchartNode[]>([]);
  const [edges, setEdges] = useState<FlowchartEdge[]>([]);
  const [view, setView] = useState({ x: 0, y: 0, zoom: 1 });
  const [selectedId, setSelectedId] = useState<string | null>(null); // Node OR Edge ID
  const [selectionType, setSelectionType] = useState<'NODE' | 'EDGE' | null>(null);
  const [activeTab, setActiveTab] = useState<'OBJECTS' | 'SCHEMA'>('OBJECTS');
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  // Interaction State
  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);

  // Linking State
  const [drawingEdge, setDrawingEdge] = useState<{ startId: string; endPos: { x: number, y: number } } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const itemStartRef = useRef({ x: 0, y: 0 });

  // Sync with prop
  useEffect(() => {
    if (visualFlow) {
      const initializedNodes = visualFlow.nodes.map((node, i) => ({
        ...node,
        x: node.x ?? (100 + (i % 3) * 250),
        y: node.y ?? (100 + Math.floor(i / 3) * 150)
      }));
      setNodes(initializedNodes);
      setEdges(visualFlow.edges);
    }
  }, [visualFlow]);

  const emitChange = useCallback((updatedNodes: FlowchartNode[], updatedEdges: FlowchartEdge[]) => {
    if (onFlowChange) {
      onFlowChange({ nodes: updatedNodes, edges: updatedEdges });
    }
  }, [onFlowChange]);

  // --- Canvas Interaction ---

  const handleMouseDown = (e: React.MouseEvent, nodeId?: string) => {
    e.preventDefault();
    const isShift = e.shiftKey;

    if (nodeId && isShift) {
      // Start Drawing Edge
      setDrawingEdge({
        startId: nodeId,
        endPos: { x: e.clientX, y: e.clientY } // Initial pos, updated in Move
      });
      return;
    }

    if (e.button !== 0) return; // Only Left Click

    if (nodeId) {
      setSelectedId(nodeId);
      setSelectionType('NODE');
      setDraggedNodeId(nodeId);
      setIsDraggingNode(true);
      const node = nodes.find(n => n.id === nodeId);
      itemStartRef.current = { x: node?.x || 0, y: node?.y || 0 };
    } else {
      // Clicked on canvas
      setIsPanning(true);
      setSelectedId(null);
      setSelectionType(null);
      itemStartRef.current = { x: view.x, y: view.y };
    }
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // 1. Drawing Edge
    if (drawingEdge && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      // Calculate mouse pos relative to canvas view coordinates to draw the line correctly
      // However, SVG line draws in absolute view coordinates, so we need logic
      const mouseX = (e.clientX - containerRect.left - view.x) / view.zoom;
      const mouseY = (e.clientY - containerRect.top - view.y) / view.zoom;

      setDrawingEdge(prev => prev ? { ...prev, endPos: { x: mouseX, y: mouseY } } : null);
      return;
    }

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    // 2. Dragging Node
    if (isDraggingNode && draggedNodeId) {
      const newX = itemStartRef.current.x + dx / view.zoom;
      const newY = itemStartRef.current.y + dy / view.zoom;

      const updatedNodes = nodes.map(n =>
        n.id === draggedNodeId ? { ...n, x: newX, y: newY } : n
      );
      setNodes(updatedNodes);
    }
    // 3. Panning Canvas
    else if (isPanning) {
      setView(prev => ({ ...prev, x: itemStartRef.current.x + dx, y: itemStartRef.current.y + dy }));
    }
  };

  const handleMouseUp = (_: React.MouseEvent, targetNodeId?: string) => {
    // Finish Drawing Edge
    if (drawingEdge) {
      if (targetNodeId && targetNodeId !== drawingEdge.startId) {
        // Create Link
        const newEdge: FlowchartEdge = {
          id: `e_${Date.now()}`,
          source: drawingEdge.startId,
          target: targetNodeId,
          label: ''
        };
        const newEdges = [...edges, newEdge];
        setEdges(newEdges);
        emitChange(nodes, newEdges);
      }
      setDrawingEdge(null);
      return;
    }

    if (isDraggingNode && draggedNodeId) {
      emitChange(nodes, edges);
    }
    setIsDraggingNode(false);
    setDraggedNodeId(null);
    setIsPanning(false);
  };

  const handleDelete = () => {
    if (!selectedId) return;

    if (selectionType === 'NODE') {
      const newNodes = nodes.filter(n => n.id !== selectedId);
      const newEdges = edges.filter(e => e.source !== selectedId && e.target !== selectedId);
      setNodes(newNodes);
      setEdges(newEdges);
      emitChange(newNodes, newEdges);
    } else if (selectionType === 'EDGE') {
      const newEdges = edges.filter(e => e.id !== selectedId);
      setEdges(newEdges);
      emitChange(nodes, newEdges);
    }
    setSelectedId(null);
    setSelectionType(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      handleDelete();
    }
  };

  // --- Drag and Drop from Sidebar ---

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    const payload = e.dataTransfer.getData('payload'); // Generic payload (e.g., table name)

    if (!type) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    const x = (mouseX - view.x) / view.zoom - 100; // Center offset
    const y = (mouseY - view.y) / view.zoom - 20;

    const id = `node_${Date.now()}`;
    let newNode: FlowchartNode = {
      id,
      type,
      label: payload || type,
      x,
      y
    };

    if (type === 'TABLE' && mockDb && mockDb[payload]) {
      // Hydrate table with schema columns
      const dbTable = mockDb[payload];
      const mappedColumns = dbTable.schema.map(c => ({
        name: c.name,
        type: c.type,
        isPrimary: c.isPrimaryKey,
        isForeign: c.isForeignKey
      }));
      newNode.label = dbTable.name;
      newNode.columns = mappedColumns;
    }

    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    emitChange(newNodes, edges);
    setSelectedId(id);
    setSelectionType('NODE');
  };

  const handleSidebarDragStart = (e: React.DragEvent, type: string, payload: string = '') => {
    e.dataTransfer.setData('type', type);
    e.dataTransfer.setData('payload', payload);
  };

  const toggleTableExpand = (tableName: string) => {
    const newSet = new Set(expandedTables);
    if (newSet.has(tableName)) newSet.delete(tableName);
    else newSet.add(tableName);
    setExpandedTables(newSet);
  };

  const handleUpdateNode = useCallback((nodeId: string, updates: Partial<FlowchartNode>) => {
    const updatedNodes = nodes.map(n => n.id === nodeId ? { ...n, ...updates } : n);
    setNodes(updatedNodes);
    emitChange(updatedNodes, edges);
  }, [nodes, edges, emitChange]);

  const handleRemoveColumn = useCallback((nodeId: string, colIndex: number) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !node.data?.columns) return;

    const newColumns = [...node.data.columns];
    newColumns.splice(colIndex, 1);

    handleUpdateNode(nodeId, {
      data: {
        ...node.data,
        columns: newColumns
      }
    });
  }, [nodes, handleUpdateNode]);

  return (
    <div className="w-full h-full bg-[#0B1120] relative overflow-hidden group flex" onKeyDown={handleKeyDown} tabIndex={0}>

      {/* Sidebar */}
      <div className="w-56 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 z-30 shadow-xl">
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('OBJECTS')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider ${activeTab === 'OBJECTS' ? 'text-blue-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Objects
          </button>
          <button
            onClick={() => setActiveTab('SCHEMA')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider ${activeTab === 'SCHEMA' ? 'text-blue-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Tables
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
          {activeTab === 'OBJECTS' ? (
            <>
              {TOOL_GROUPS.map(group => (
                <div key={group.name}>
                  <div className="text-[10px] font-bold text-slate-600 uppercase mb-2 px-1">{group.name}</div>
                  <div className="grid grid-cols-2 gap-2">
                    {group.items.map(item => (
                      <div
                        key={item.type}
                        draggable
                        onDragStart={(e) => handleSidebarDragStart(e, item.type)}
                        className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded p-2 flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing transition-colors"
                      >
                        <item.icon className="w-4 h-4 text-slate-400" />
                        <span className="text-[9px] text-slate-300 text-center">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="space-y-2">
              {mockDb ? Object.keys(mockDb).map(tableName => (
                <div key={tableName} className="border border-slate-700 rounded bg-slate-800 overflow-hidden">
                  <div
                    className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-700/50"
                    onClick={() => toggleTableExpand(tableName)}
                    draggable
                    onDragStart={(e) => handleSidebarDragStart(e, 'TABLE', tableName)}
                  >
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-slate-300 font-medium">{tableName}</span>
                    </div>
                    {expandedTables.has(tableName) ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                  </div>

                  {expandedTables.has(tableName) && (
                    <div className="bg-slate-950/30 p-2 space-y-1 border-t border-slate-800">
                      {mockDb[tableName].schema.map(col => (
                        <div
                          key={col.name}
                          className="flex items-center justify-between px-2 py-1 rounded hover:bg-slate-800/50 text-[10px] cursor-grab active:cursor-grabbing group"
                          draggable
                          onDragStart={(e) => {
                            e.stopPropagation();
                            e.dataTransfer.setData('type', 'COLUMN');
                            e.dataTransfer.setData('payload', JSON.stringify({
                              column: col.name,
                              table: tableName,
                              type: col.type
                            }));
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {col.isPrimaryKey && <Key className="w-2.5 h-2.5 text-amber-500" />}
                            {col.isForeignKey && <Share2 className="w-2.5 h-2.5 text-purple-500" />}
                            <span className="text-slate-400 group-hover:text-white transition-colors">{col.name}</span>
                          </div>
                          <span className="text-slate-600 font-mono">{col.type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )) : (
                <div className="text-xs text-slate-500 text-center py-4">No Schema Loaded</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative h-full">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
            backgroundSize: `${20 * view.zoom}px ${20 * view.zoom}px`,
            backgroundPosition: `${view.x}px ${view.y}px`
          }}
        />

        <div className="absolute top-4 left-4 z-40 flex items-center gap-4 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded px-3 py-2 text-xs text-slate-400">
            <span className="font-bold text-blue-400">Shift + Drag</span> to link • <span className="font-bold text-red-400">Del</span> to remove
          </div>
        </div>

        <div
          ref={containerRef}
          className="w-full h-full overflow-hidden relative cursor-move outline-none"
          onMouseDown={(e) => handleMouseDown(e)}
          onMouseMove={handleMouseMove}
          onMouseUp={(e) => handleMouseUp(e)}
          onMouseLeave={(e) => handleMouseUp(e)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div
            className="absolute top-0 left-0 origin-top-left will-change-transform"
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})` }}
          >
            <svg className="absolute inset-0 w-[8000px] h-[8000px] pointer-events-none overflow-visible" style={{ transform: 'translate(-4000px, -4000px)' }}>
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                </marker>
                <marker id="arrowhead-selected" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
                </marker>
              </defs>

              {/* Existing Edges */}
              {edges.map(edge => {
                const start = nodes.find(n => n.id === edge.source);
                const end = nodes.find(n => n.id === edge.target);
                if (!start || !end) return null;
                const adjStart = { x: (start.x || 0) + 4000, y: (start.y || 0) + 4000 };
                const adjEnd = { x: (end.x || 0) + 4000, y: (end.y || 0) + 4000 };
                const isSelected = selectedId === edge.id;

                return (
                  <ConnectionLine
                    key={edge.id}
                    edge={edge}
                    start={adjStart}
                    end={adjEnd}
                    selected={isSelected}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(edge.id);
                      setSelectionType('EDGE');
                    }}
                  />
                );
              })}

              {/* Temporary Drawing Edge */}
              {drawingEdge && (
                <path
                  d={`M ${(nodes.find(n => n.id === drawingEdge.startId)?.x || 0) + 4000 + 100} ${(nodes.find(n => n.id === drawingEdge.startId)?.y || 0) + 4000 + 25} L ${drawingEdge.endPos.x + 4000} ${drawingEdge.endPos.y + 4000}`}
                  stroke="#60a5fa"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  fill="none"
                />
              )}
            </svg>

            {nodes.map(node => {
              const style = { left: node.x || 0, top: node.y || 0 };
              const isSelected = selectedId === node.id;

              const props = {
                key: node.id,
                node,
                style,
                isSelected,
                onMouseDown: (e: React.MouseEvent) => { e.stopPropagation(); handleMouseDown(e, node.id); },
                onDelete: () => {
                  const newNodes = nodes.filter(n => n.id !== node.id);
                  const newEdges = edges.filter(e => e.source !== node.id && e.target !== node.id);
                  setNodes(newNodes);
                  setEdges(newEdges);
                  emitChange(newNodes, newEdges);
                }
              };

              // Add mouseUp listener to node specifically to catch drop target
              const nodeWithDrop = (
                <div
                  onMouseUp={(e) => { e.stopPropagation(); handleMouseUp(e, node.id); }}
                >
                  {node.type === 'TABLE' ? (
                    <TableNodeComponent {...props} />
                  ) : (
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const type = e.dataTransfer.getData('type');

                        if (type === 'COLUMN' || type === 'FUNCTION') {
                          const payload = e.dataTransfer.getData('payload');

                          // Handle Functions
                          if (type === 'FUNCTION') {
                            const funcName = payload || type;
                            const currentColumns = node.data?.columns || [];
                            const newEntry = { table: '', column: `${funcName}(*)`, type: 'FUNCTION' };

                            const updatedNode = {
                              ...node,
                              data: { ...node.data, columns: [...currentColumns, newEntry] }
                            };
                            const newNodes = nodes.map(n => n.id === node.id ? updatedNode : n);
                            setNodes(newNodes);
                            emitChange(newNodes, edges);
                            return;
                          }

                          const colData = JSON.parse(payload); // { column, table, type }

                          // Validation: Check if the table exists in the canvas
                          const tableNodeExists = nodes.some(n => n.type === 'TABLE' && n.label === colData.table);
                          if (!tableNodeExists) {
                            alert(`Table "${colData.table}" must be added to the canvas first!`);
                            return;
                          }

                          // Append column to node data with Logic Prompt
                          const currentColumns = node.data?.columns || [];
                          const exists = currentColumns.find((c: any) => c.column === colData.column && c.table === colData.table);

                          if (!exists) {
                            let logic = '';
                            let operator = '';
                            let value = '';

                            // Prompt logic if not the first column (for WHERE/HAVING/JOIN)
                            if (currentColumns.length > 0 && ['WHERE', 'HAVING', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN'].includes(node.type.toUpperCase())) {
                              const userLogic = window.prompt("Enter Logic (AND, OR):", "AND");
                              if (userLogic) logic = userLogic.toUpperCase();
                            }

                            // Prompt Operator/Value for JOIN/WHERE/HAVING
                            if (['WHERE', 'HAVING', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN'].includes(node.type.toUpperCase())) {
                              const userOp = window.prompt("Enter Operator (=, >, <, LIKE...):", "=");
                              if (userOp) operator = userOp;

                              const userVal = window.prompt("Enter Value (or leave empty for reference):", "");
                              if (userVal) value = userVal;
                            }

                            const newColEntry = {
                              ...colData,
                              logic,
                              operator,
                              value
                            };

                            const updatedNode = {
                              ...node,
                              data: {
                                ...node.data,
                                columns: [...currentColumns, newColEntry]
                              }
                            };
                            const newNodes = nodes.map(n => n.id === node.id ? updatedNode : n);
                            setNodes(newNodes);
                            emitChange(newNodes, edges);
                          }
                        }
                      }}
                    >
                      <OperationNodeComponent
                        {...props}
                        onRemoveColumn={(idx) => handleRemoveColumn(node.id, idx)}
                      />
                    </div>
                  )}
                </div>
              );

              return <div key={node.id}>{nodeWithDrop}</div>;
            })}
          </div>
        </div>

        {/* View Controls & Delete */}
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          {selectedId && (
            <button onClick={handleDelete} className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/50 p-2 rounded-lg backdrop-blur shadow-lg transition-colors" title="Delete Selected">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-1 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-lg p-1 shadow-lg">
            <button onClick={() => setView(v => ({ ...v, zoom: v.zoom - 0.1 }))} className="p-1.5 hover:bg-slate-700 rounded text-slate-300">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={() => setView(v => ({ ...v, zoom: 1 }))} className="p-1.5 hover:bg-slate-700 rounded text-slate-300">
              <Maximize className="w-4 h-4" />
            </button>
            <button onClick={() => setView(v => ({ ...v, zoom: v.zoom + 0.1 }))} className="p-1.5 hover:bg-slate-700 rounded text-slate-300">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
