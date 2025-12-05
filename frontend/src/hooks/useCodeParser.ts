import { useMemo } from 'react';
import { CanvasBlock } from './useBlocks';
import { Language } from '../data/blockDefinitions';

/**
 * Code parser for extracting block values from edited code
 * Supports pattern matching for common block types across multiple languages
 */

interface ParsedBlockValue {
    blockId: string;
    key: string;
    value: string;
}

interface CodeParseResult {
    updates: ParsedBlockValue[];
    hasChanges: boolean;
}

/**
 * Pattern definitions for extracting values from different block types
 */
const BLOCK_PATTERNS: Record<string, Record<Language, RegExp>> = {
    print: {
        javascript: /console\.log\((.*?)\);?/,
        typescript: /console\.log\((.*?)\);?/,
        python: /print\((.*?)\)/,
        java: /System\.out\.println\((.*?)\);?/,
        c: /printf\(".*?",\s*(.*?)\);?/,
        cpp: /std::cout\s*<<\s*(.*?)\s*<<\s*std::endl;?/,
        ruby: /puts\s+(.*)/,
        sql: /(.*)/,  // Not applicable
        html: /(.*)/,  // Not applicable
        css: /(.*)/,   // Not applicable
    },
    variable: {
        javascript: /const\s+(\w+)\s*=\s*(.*?);?/,
        typescript: /const\s+(\w+)\s*=\s*(.*?);?/,
        python: /(\w+)\s*=\s*(.*)/,
        java: /var\s+(\w+)\s*=\s*(.*?);?/,
        c: /int\s+(\w+)\s*=\s*(.*?);?/,
        cpp: /auto\s+(\w+)\s*=\s*(.*?);?/,
        ruby: /(\w+)\s*=\s*(.*)/,
        sql: /(.*)/,
        html: /(.*)/,
        css: /(.*)/,
    },
};

/**
 * Extract value from a code line based on block type and language
 */
function extractValueFromLine(
    line: string,
    blockType: string,
    language: Language
): string | null {
    const patterns = BLOCK_PATTERNS[blockType];
    if (!patterns) return null;

    const pattern = patterns[language];
    if (!pattern) return null;

    const match = line.trim().match(pattern);
    if (!match) return null;

    // For print statements, return the first capture group (the value)
    if (blockType === 'print') {
        return match[1]?.trim() || null;
    }

    // For variables, return the second capture group (the value, not the name)
    if (blockType === 'variable') {
        return match[2]?.trim() || null;
    }

    return match[1]?.trim() || null;
}

/**
 * Parse edited code and extract block value updates
 */
export function useCodeParser(
    editedCode: string,
    blocks: CanvasBlock[],
    blockCodeMap: Map<string, { start: number; end: number }>,
    language: Language
): CodeParseResult {
    return useMemo(() => {
        const updates: ParsedBlockValue[] = [];
        const codeLines = editedCode.split('\n');

        // Iterate through each block and check if its code has been modified
        for (const block of blocks) {
            const range = blockCodeMap.get(block.id);
            if (!range) continue;

            // Get the code lines for this block
            const blockLines = codeLines.slice(range.start, range.end + 1);

            // Try to extract value based on block type
            for (const line of blockLines) {
                const extractedValue = extractValueFromLine(
                    line,
                    block.type,
                    language
                );

                if (extractedValue !== null) {
                    // Check if the value has actually changed
                    const currentValue = block.values.value || block.definition.defaultValue?.value;

                    if (extractedValue !== currentValue) {
                        updates.push({
                            blockId: block.id,
                            key: 'value',
                            value: extractedValue,
                        });
                    }
                    break; // Only process first matching line per block
                }
            }

            // Special handling for variable blocks (extract name too)
            if (block.type === 'variable') {
                const namePattern = BLOCK_PATTERNS.variable[language];
                for (const line of blockLines) {
                    const match = line.trim().match(namePattern);
                    if (match && match[1]) {
                        const extractedName = match[1].trim();
                        const currentName = block.values.name || block.definition.defaultValue?.name;

                        if (extractedName !== currentName) {
                            updates.push({
                                blockId: block.id,
                                key: 'name',
                                value: extractedName,
                            });
                        }
                        break;
                    }
                }
            }
        }

        return {
            updates,
            hasChanges: updates.length > 0,
        };
    }, [editedCode, blocks, blockCodeMap, language]);
}

/**
 * Helper to check if a block type supports value editing
 */
export function supportsValueEditing(blockType: string): boolean {
    return blockType in BLOCK_PATTERNS;
}
