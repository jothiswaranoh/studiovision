import { useMemo } from 'react';
import { CanvasBlock, Connection } from './useBlocks';
import { Language } from '../data/blockDefinitions';

export { type Language };

export interface CodeGenerationResult {
    code: string;
    blockCodeMap: Map<string, { start: number; end: number }>;
}

const getCommentPrefix = (lang: Language) => {
    switch (lang) {
        case 'python':
        case 'ruby':
            return '#';
        case 'sql':
            return '--';
        case 'html':
            return '<!--';
        default:
            return '//';
    }
};

export const useCodeGeneration = (
    blocks: CanvasBlock[],
    connections: Connection[],
    language: Language
): CodeGenerationResult => {
    return useMemo(() => {
        const blockCodeMap = new Map<string, { start: number; end: number }>();
        const commentPrefix = getCommentPrefix(language);

        if (blocks.length === 0) {
            let defaultCode = '';
            if (language === 'python') {
                defaultCode = `# Drag blocks from the library to start coding!\n\ndef main():\n    # Your visual blocks will generate code here\n    pass\n\nif __name__ == "__main__":\n    main()`;
            } else if (language === 'html') {
                defaultCode = `<!-- Drag blocks from the library to start coding! -->\n\n<!DOCTYPE html>\n<html>\n<body>\n    <!-- Your visual blocks will generate code here -->\n</body>\n</html>`;
            } else if (language === 'sql') {
                defaultCode = `-- Drag blocks from the library to start coding!\n\n-- Your visual blocks will generate code here`;
            } else {
                defaultCode = `${commentPrefix} Drag blocks from the library to start coding!\n\nfunction main() {\n  ${commentPrefix} Your visual blocks will generate code here\n}\n\nmain();`;
            }

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
        codeLines.push(`${commentPrefix} Generated Code - Visual Programming Platform`);
        codeLines.push('');

        // Track current line for block mapping
        let currentLine = codeLines.length;

        const generateBlockCode = (block: CanvasBlock, indent: string = ''): void => {
            if (processedBlocks.has(block.id)) return;
            processedBlocks.add(block.id);

            const startLine = currentLine;

            // Generate code based on block type and language
            const template = block.definition.codeTemplates[language];

            let generatedCode = '';
            if (template) {
                generatedCode = template(block.values);
            } else {
                generatedCode = `${commentPrefix} Block '${block.definition.name}' not supported in ${language}`;
            }

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
