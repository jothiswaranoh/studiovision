import { useMemo } from 'react';
import { CanvasBlock, Connection } from './useBlocks';

export type Language = 'javascript' | 'python';

export interface CodeGenerationResult {
    code: string;
    blockCodeMap: Map<string, { start: number; end: number }>;
}

export const useCodeGeneration = (
    blocks: CanvasBlock[],
    connections: Connection[],
    language: Language
): CodeGenerationResult => {
    return useMemo(() => {
        const blockCodeMap = new Map<string, { start: number; end: number }>();

        if (blocks.length === 0) {
            const defaultCode = language === 'javascript'
                ? '// Drag blocks from the library to start coding!\n\nfunction main() {\n  // Your visual blocks will generate code here\n}\n\nmain();'
                : '# Drag blocks from the library to start coding!\n\ndef main():\n    # Your visual blocks will generate code here\n    pass\n\nif __name__ == "__main__":\n    main()';

            return { code: defaultCode, blockCodeMap };
        }

        // Build a graph from connections
        const outgoingConnections = new Map<string, Connection[]>();
        connections.forEach((conn) => {
            const existing = outgoingConnections.get(conn.fromBlockId) || [];
            existing.push(conn);
            outgoingConnections.set(conn.fromBlockId, existing);
        });

        // Find start blocks (blocks with no flow-in connections)
        const blocksWithFlowIn = new Set(
            connections
                .filter((c) => c.toPortId.includes('flow'))
                .map((c) => c.toBlockId)
        );

        let startBlocks = blocks.filter(
            (b) =>
                b.type === 'start' ||
                (b.definition.inputs.every((i) => i.type !== 'flow-in') &&
                    !blocksWithFlowIn.has(b.id))
        );

        // If no start blocks found, use all blocks
        if (startBlocks.length === 0) {
            startBlocks = [...blocks];
        }

        // Generate code for each block
        const codeLines: string[] = [];
        const processedBlocks = new Set<string>();

        // Add header comment
        if (language === 'javascript') {
            codeLines.push('// Generated Code - Visual Programming Platform');
            codeLines.push('');
        } else {
            codeLines.push('# Generated Code - Visual Programming Platform');
            codeLines.push('');
        }

        // Track current line for block mapping
        let currentLine = codeLines.length;

        const generateBlockCode = (block: CanvasBlock, indent: string = ''): void => {
            if (processedBlocks.has(block.id)) return;
            processedBlocks.add(block.id);

            const startLine = currentLine;

            // Generate code based on block type and language
            const template = language === 'javascript'
                ? block.definition.codeTemplateJS
                : block.definition.codeTemplatePython;

            const generatedCode = template(block.values);
            const lines = generatedCode.split('\n');

            lines.forEach((line) => {
                codeLines.push(indent + line);
                currentLine++;
            });

            // Map block to code lines
            blockCodeMap.set(block.id, { start: startLine, end: currentLine - 1 });

            // Add empty line after each block
            codeLines.push('');
            currentLine++;

            // Process connected blocks (follow flow connections)
            const outgoing = outgoingConnections.get(block.id) || [];
            outgoing
                .filter((c) => c.fromPortId.includes('flow'))
                .forEach((conn) => {
                    const nextBlock = blocks.find((b) => b.id === conn.toBlockId);
                    if (nextBlock) {
                        generateBlockCode(nextBlock, indent);
                    }
                });
        };

        // Process all start blocks
        startBlocks.forEach((block) => generateBlockCode(block));

        // Process any remaining unprocessed blocks
        blocks.forEach((block) => {
            if (!processedBlocks.has(block.id)) {
                generateBlockCode(block);
            }
        });

        return { code: codeLines.join('\n'), blockCodeMap };
    }, [blocks, connections, language]);
};

// Utility to find block ID from code line
export const findBlockFromLine = (
    line: number,
    blockCodeMap: Map<string, { start: number; end: number }>
): string | null => {
    for (const [blockId, range] of blockCodeMap) {
        if (line >= range.start && line <= range.end) {
            return blockId;
        }
    }
    return null;
};
