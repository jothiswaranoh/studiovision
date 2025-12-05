import { useState, useMemo } from 'react';
import { GripVertical, Search, ChevronRight, ChevronLeft, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import {
    BLOCK_GROUPS,
    BLOCK_DEFINITIONS,
    BlockGroupKey,
    BlockDefinition,
    BLOCK_CATEGORIES,
    BlockCategory,
} from '../data/blockDefinitions';

interface SidebarBlockLibraryProps {
    selectedGroup: BlockGroupKey;
    onDragStart: (definition: BlockDefinition) => void;
    width: number;
    onResize: (e: React.MouseEvent) => void;
    isOpen?: boolean;
    onToggle?: (isOpen: boolean) => void;
}

export default function SidebarBlockLibrary({
    selectedGroup,
    onDragStart,
    width,
    onResize,
    isOpen: externalIsOpen,
    onToggle: externalOnToggle,
}: SidebarBlockLibraryProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [internalIsOpen, setInternalIsOpen] = useState(true);

    // Determine if controlled by parent or internally
    const isControlled = externalIsOpen !== undefined;
    const isOpen = isControlled ? externalIsOpen : internalIsOpen;

    const group = BLOCK_GROUPS[selectedGroup];

    const blocks = useMemo(() => {
        const categories = group.categories as readonly string[];
        let filtered = BLOCK_DEFINITIONS.filter((b) =>
            categories.includes(b.category)
        );

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (b) =>
                    b.name.toLowerCase().includes(q) ||
                    b.description.toLowerCase().includes(q)
            );
        }

        return filtered;
    }, [selectedGroup, searchQuery]);

    const handleDragStart = (e: React.DragEvent, block: BlockDefinition) => {
        e.dataTransfer.setData('application/json', JSON.stringify(block));
        e.dataTransfer.effectAllowed = 'copy';
        onDragStart(block);
    };

    const handleToggle = () => {
        const newState = !isOpen;
        if (isControlled) {
            externalOnToggle?.(newState);
        } else {
            setInternalIsOpen(newState);
        }
    };

    // When sidebar is closed, show only a toggle button
    if (!isOpen) {
        return (
            <div className="relative">
                {/* Toggle button when collapsed */}
                <button
                    onClick={handleToggle}
                    className="absolute top-4 left-0 z-50 p-2 bg-void/80 border border-white/10 border-l-0 rounded-r-md text-white/60 hover:text-neon-cyan hover:bg-void transition-all backdrop-blur-sm"
                    title="Open block library"
                >
                    <PanelLeftOpen size={16} />
                </button>
            </div>
        );
    }

    return (
        <div
            className="bg-void/50 border-r border-white/10 flex flex-col relative"
            style={{ width }}
        >
            {/* Resize Handle */}
            <div
                onMouseDown={onResize}
                className="absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-white/5 hover:bg-neon-cyan/40 transition"
            />

            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white/80 font-medium text-sm flex items-center gap-2">
                        <group.icon size={16} className="text-neon-cyan" />
                        {group.name}
                    </h3>

                    <button
                        onClick={handleToggle}
                        className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-neon-cyan transition-colors"
                        title="Collapse block library"
                    >
                        <PanelLeftClose size={16} />
                    </button>
                </div>

                {/* Search Input */}
                <div className="relative">
                    <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                    />
                    <input
                        type="text"
                        placeholder={`Search ${group.name}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/30 focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/50 outline-none transition-all duration-200"
                    />
                </div>
            </div>

            {/* Block List */}
            <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
                {blocks.length > 0 ? (
                    blocks.map((block) => {
                        const categoryInfo = BLOCK_CATEGORIES[block.category as BlockCategory];
                        const Icon = block.icon;

                        return (
                            <div
                                key={block.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, block)}
                                className="group flex items-center gap-3 p-3 mb-2 rounded-lg bg-surface border border-white/5 hover:border-neon-cyan/30 hover:bg-white/5 cursor-grab active:cursor-grabbing transition-all duration-200"
                            >
                                <div
                                    className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: categoryInfo.bgColor }}
                                >
                                    <Icon size={16} style={{ color: categoryInfo.color }} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-white truncate group-hover:text-neon-cyan transition-colors">
                                        {block.name}
                                    </div>
                                    <div className="text-xs text-white/40 truncate">
                                        {block.description}
                                    </div>
                                </div>

                                <GripVertical
                                    size={14}
                                    className="text-white/20 group-hover:text-white/40 transition-colors"
                                />
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-white/30 text-xs">
                        No blocks found
                    </div>
                )}
            </div>
        </div>
    );
}