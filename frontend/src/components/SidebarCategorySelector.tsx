import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BLOCK_GROUPS, BlockGroupKey } from '../data/blockDefinitions';

interface SidebarCategorySelectorProps {
    selectedGroup: BlockGroupKey;
    onSelectGroup: (group: BlockGroupKey) => void;
    width: number;
    onResize: (e: React.MouseEvent) => void;
    isOpen?: boolean; // Optional prop to control from parent
    onToggle?: (isOpen: boolean) => void; // Optional callback for parent control
}

export default function SidebarCategorySelector({
    selectedGroup,
    onSelectGroup,
    width,
    onResize,
    isOpen: externalIsOpen,
    onToggle: externalOnToggle,
}: SidebarCategorySelectorProps) {
    // Internal state for toggle if not controlled externally
    const [internalIsOpen, setInternalIsOpen] = useState(true);

    // Determine if controlled by parent or internally
    const isControlled = externalIsOpen !== undefined;
    const isOpen = isControlled ? externalIsOpen : internalIsOpen;

    const handleToggle = () => {
        const newState = !isOpen;
        if (isControlled) {
            externalOnToggle?.(newState);
        } else {
            setInternalIsOpen(newState);
        }
    };

    return (
        <>
            {/* Collapsed State - Only Show Toggle Button */}
            {!isOpen ? (
                <div className="relative">
                    <div className="bg-surface border-r border-white/10 w-12 flex flex-col items-center py-4">
                        {/* Header in collapsed state */}
                        <div className="p-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
                        </div>

                        {/* List in collapsed state - only icons */}
                        <div className="flex-1 overflow-y-auto py-2">
                            {Object.entries(BLOCK_GROUPS).map(([key, group]) => {
                                const isSelected = selectedGroup === key;
                                const Icon = group.icon;

                                return (
                                    <button
                                        key={key}
                                        onClick={() => onSelectGroup(key as BlockGroupKey)}
                                        className={`w-8 h-8 flex items-center justify-center mb-2 rounded transition-all duration-200 ${isSelected
                                            ? 'bg-white/10 text-neon-cyan'
                                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                                            }`}
                                        title={group.name}
                                    >
                                        <Icon
                                            size={18}
                                            className={isSelected ? 'text-neon-cyan' : 'text-white/40'}
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Toggle Button */}
                        <button
                            onClick={handleToggle}
                            className="mt-4 p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-neon-cyan transition-colors"
                            title="Expand sidebar"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* Resize Handle in collapsed state */}
                    <div
                        onMouseDown={onResize}
                        className="absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-white/5 hover:bg-neon-cyan/40 transition"
                    />
                </div>
            ) : (
                /* Expanded State - Full Sidebar */
                <div
                    className="bg-surface border-r border-white/10 flex flex-col relative"
                    style={{ width }}
                >
                    {/* Resize Handle */}
                    <div
                        onMouseDown={onResize}
                        className="absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-white/5 hover:bg-neon-cyan/40 transition"
                    />

                    {/* Header */}
                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                        <h2 className="font-orbitron font-semibold text-sm text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
                            Domains
                        </h2>

                        {/* Toggle Button */}
                        <button
                            onClick={handleToggle}
                            className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-neon-cyan transition-colors"
                            title="Collapse sidebar"
                        >
                            <ChevronLeft size={16} />
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
                        {Object.entries(BLOCK_GROUPS).map(([key, group]) => {
                            const isSelected = selectedGroup === key;
                            const Icon = group.icon;

                            return (
                                <button
                                    key={key}
                                    onClick={() => onSelectGroup(key as BlockGroupKey)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 border-l-2 ${isSelected
                                        ? 'bg-white/5 border-neon-cyan text-neon-cyan'
                                        : 'border-transparent text-white/60 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <Icon
                                        size={18}
                                        className={isSelected ? 'text-neon-cyan' : 'text-white/40'}
                                    />
                                    <span className="text-sm font-medium">{group.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}