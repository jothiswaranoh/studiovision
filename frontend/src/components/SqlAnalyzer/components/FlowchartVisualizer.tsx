import React, { useState, useEffect, useRef } from 'react';
import { VisualFlow, FlowchartNode, FlowchartEdge } from '../types';

interface FlowchartVisualizerProps {
  flow: VisualFlow;
  onStepClick: (stepId: number) => void;
  activeStepId: number;
}

interface NodePosition {
  x: number;
  y: number;
}

export const FlowchartVisualizer: React.FC<FlowchartVisualizerProps> = ({ flow, onStepClick, activeStepId }) => {
  const [nodes, setNodes] = useState<FlowchartNode[]>([]);
  const [positions, setPositions] = useState<Record<string, NodePosition>>({});
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef<{ x: number, y: number }>({ x: 0, y: 0 });

  // Initialize nodes and auto-layout
  useEffect(() => {
    if (flow && flow.nodes) {
      setNodes(flow.nodes);
      
      // Simple Auto Layout if positions not set
      const newPositions: Record<string, NodePosition> = {};
      const levels: Record<string, number> = {};
      
      // Basic topological sort approximation by node type
      flow.nodes.forEach((node, i) => {
        let level = 0;
        if (node.type === 'TABLE') level = 0;
        else if (node.type === 'JOIN') level = 1;
        else if (node.type === 'FILTER') level = 2;
        else if (node.type === 'AGGREGATE') level = 3;
        else if (node.type === 'SELECT') level = 4;
        else level = 2;

        // Distribute vertically based on index
        const siblings = flow.nodes.filter(n => n.type === node.type);
        const siblingIndex = siblings.findIndex(s => s.id === node.id);
        
        newPositions[node.id] = {
            x: 50 + (level * 180),
            y: 50 + (siblingIndex * 120)
        };
      });
      setPositions(newPositions);
    }
  }, [flow]);

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    setDraggingNodeId(nodeId);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    // Use container offset
    if(containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - positions[nodeId].x - containerRect.left,
            y: e.clientY - positions[nodeId].y - containerRect.top
        };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - containerRect.left - dragOffset.current.x;
        const y = e.clientY - containerRect.top - dragOffset.current.y;
        
        setPositions(prev => ({
            ...prev,
            [draggingNodeId]: { x, y }
        }));
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  const getNodeColor = (type: string) => {
    switch (type) {
        case 'TABLE': return 'bg-blue-600 border-blue-400';
        case 'JOIN': return 'bg-purple-600 border-purple-400';
        case 'FILTER': return 'bg-yellow-600 border-yellow-400';
        case 'AGGREGATE': return 'bg-orange-600 border-orange-400';
        case 'SELECT': return 'bg-green-600 border-green-400';
        default: return 'bg-gray-600 border-gray-400';
    }
  };

  return (
    <div 
        ref={containerRef}
        className="relative w-full h-full bg-[#151515] overflow-hidden select-none cursor-grab active:cursor-grabbing"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ 
            backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', 
            backgroundSize: '20px 20px' 
        }}
    >
        {/* SVG Layer for Edges */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
                </marker>
            </defs>
            {flow.edges.map(edge => {
                const start = positions[edge.source];
                const end = positions[edge.target];
                if (!start || !end) return null;
                
                // Adjust curve points
                const controlPoint1X = start.x + 100; // Curve out to right
                const controlPoint1Y = start.y + 40;  // Center of node approx
                const controlPoint2X = end.x - 100;   // Curve in from left
                const controlPoint2Y = end.y + 40;

                return (
                    <g key={edge.id}>
                        <path 
                            d={`M${start.x + 140},${start.y + 30} C${controlPoint1X},${start.y + 30} ${controlPoint2X},${end.y + 30} ${end.x},${end.y + 30}`}
                            stroke="#4b5563"
                            strokeWidth="2"
                            fill="none"
                            markerEnd="url(#arrowhead)"
                        />
                        {edge.label && (
                            <text x={(start.x + end.x) / 2 + 50} y={(start.y + end.y) / 2} fill="#9ca3af" fontSize="10" className="bg-gray-900">
                                {edge.label}
                            </text>
                        )}
                    </g>
                );
            })}
        </svg>

        {/* Nodes Layer */}
        {nodes.map(node => {
            const pos = positions[node.id];
            if (!pos) return null;
            
            const isActive = node.stepId === activeStepId;
            const hasStep = node.stepId !== undefined;

            return (
                <div
                    key={node.id}
                    onMouseDown={(e) => handleMouseDown(e, node.id)}
                    onClick={() => hasStep && node.stepId && onStepClick(node.stepId)}
                    style={{
                        transform: `translate(${pos.x}px, ${pos.y}px)`,
                        width: '140px'
                    }}
                    className={`
                        absolute top-0 left-0 z-10 p-2 rounded-lg border-2 shadow-lg transition-shadow
                        ${getNodeColor(node.type)}
                        ${isActive ? 'ring-2 ring-white scale-105' : 'opacity-90 hover:opacity-100'}
                        ${hasStep ? 'cursor-pointer' : ''}
                    `}
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold uppercase text-white/70 tracking-wider">{node.type}</span>
                        {hasStep && <span className="bg-black/30 text-white text-[9px] px-1 rounded">Step {node.stepId}</span>}
                    </div>
                    <div className="text-sm font-semibold text-white truncate" title={node.label}>
                        {node.label}
                    </div>
                </div>
            );
        })}
        
        <div className="absolute bottom-2 right-2 bg-gray-900/80 p-2 rounded text-[10px] text-gray-400 pointer-events-none border border-gray-700">
            Drag nodes to rearrange • Click nodes to view data
        </div>
    </div>
  );
};
