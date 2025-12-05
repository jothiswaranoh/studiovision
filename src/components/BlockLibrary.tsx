import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { BLOCK_CATEGORIES, CATEGORIZED_BLOCKS, BlockDefinition, BlockCategory } from '../data/blockDefinitions';

interface BlockLibraryProps {
  onDragStart: (definition: BlockDefinition) => void;
}

export default function BlockLibrary({ onDragStart }: BlockLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(BLOCK_CATEGORIES))
  );

  // Filter blocks based on search
  const filteredBlocks = useMemo(() => {
    if (!searchQuery.trim()) return CATEGORIZED_BLOCKS;

    const query = searchQuery.toLowerCase();
    const result: Record<BlockCategory, BlockDefinition[]> = {} as Record<BlockCategory, BlockDefinition[]>;

    Object.entries(CATEGORIZED_BLOCKS).forEach(([category, blocks]) => {
      const filtered = blocks.filter(
        (block) =>
          block.name.toLowerCase().includes(query) ||
          block.description.toLowerCase().includes(query)
      );
      if (filtered.length > 0) {
        result[category as BlockCategory] = filtered;
      }
    });

    return result;
  }, [searchQuery]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleDragStart = (e: React.DragEvent, block: BlockDefinition) => {
    e.dataTransfer.setData('application/json', JSON.stringify(block));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(block);
  };

  return (
    <div className="w-64 min-w-[256px] bg-surface border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="font-orbitron font-semibold text-sm text-white mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          Block Library
        </h2>

        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-void/50 border border-white/10 text-white text-sm placeholder:text-white/40 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* Block Categories */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        {Object.entries(filteredBlocks).map(([category, blocks]) => {
          const categoryInfo = BLOCK_CATEGORIES[category as BlockCategory];
          const isExpanded = expandedCategories.has(category);

          return (
            <div key={category} className="mb-1">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-white/5 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown size={14} className="text-white/50" />
                ) : (
                  <ChevronRight size={14} className="text-white/50" />
                )}
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: categoryInfo.color }}
                />
                <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                  {categoryInfo.name}
                </span>
                <span className="ml-auto text-xs text-white/40">
                  {blocks.length}
                </span>
              </button>

              {/* Blocks */}
              {isExpanded && (
                <div className="px-2 py-1">
                  {blocks.map((block) => {
                    const Icon = block.icon;
                    return (
                      <div
                        key={block.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, block)}
                        className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 group hover:scale-[1.02]"
                        style={{
                          backgroundColor: categoryInfo.bgColor,
                          border: `1px solid ${categoryInfo.color}30`,
                        }}
                        title={block.description}
                      >
                        <GripVertical
                          size={12}
                          className="text-white/30 group-hover:text-white/60 transition-colors"
                        />
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center"
                          style={{ backgroundColor: `${categoryInfo.color}30` }}
                        >
                          <Icon
                            size={14}
                            style={{ color: categoryInfo.color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">
                            {block.name}
                          </div>
                          <div className="text-xs text-white/50 truncate">
                            {block.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {Object.keys(filteredBlocks).length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Search size={32} className="text-white/20 mb-2" />
            <p className="text-white/40 text-sm">No blocks found</p>
            <p className="text-white/30 text-xs">Try a different search term</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <p className="text-xs text-white/40 text-center">
          Drag blocks to canvas to build
        </p>
      </div>
    </div>
  );
}
