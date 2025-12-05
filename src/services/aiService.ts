// Simulated AI Service for code explanation, optimization, and conversion
// Replace with real API calls when integrating with OpenAI, Claude, etc.

export interface AIResponse {
    content: string;
    type: 'explanation' | 'optimization' | 'conversion' | 'suggestion' | 'error';
    loading?: boolean;
}

// Simulated delay for AI responses
const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Explain code
export const explainCode = async (code: string, language: 'javascript' | 'python'): Promise<AIResponse> => {
    await simulateDelay(800);

    const explanations: Record<string, string> = {
        'if': `📌 **Conditional Statement**\nThis code uses an \`if/else\` statement to make decisions.\n\n• The condition inside \`if()\` is evaluated\n• If true, the first block executes\n• If false, the \`else\` block runs\n\n💡 **Tip**: Conditions can use comparison operators like \`===\`, \`>\`, \`<\`, etc.`,
        'for': `🔄 **For Loop**\nThis loop repeats code a specific number of times.\n\n• \`i = 0\` starts the counter\n• The condition checks if we should continue\n• \`i++\` increments after each iteration\n\n💡 **Tip**: Use arrays with \`forEach()\` for cleaner iteration in JavaScript.`,
        'while': `🔁 **While Loop**\nRepeats as long as the condition is true.\n\n⚠️ **Warning**: Make sure the condition eventually becomes false to avoid infinite loops!\n\n💡 **Tip**: Use \`break\` to exit early if needed.`,
        'function': `⚡ **Function Definition**\nFunctions are reusable blocks of code.\n\n• Parameters pass data in\n• \`return\` sends data back\n• Call with \`functionName(args)\`\n\n💡 **Tip**: Keep functions small and focused on one task.`,
        'fetch': `🌐 **API Request**\nThis makes an HTTP request to retrieve data.\n\n• \`await\` pauses until the response arrives\n• \`.json()\` parses the response\n• Handle errors with try/catch\n\n💡 **Tip**: Always handle network errors gracefully.`,
        'console': `📝 **Console Output**\nPrints information for debugging.\n\n• \`console.log()\` - General output\n• \`console.error()\` - Error messages  \n• \`console.warn()\` - Warnings\n\n💡 **Tip**: Remove console logs before production.`,
        'print': `📝 **Print Statement**\nOutputs text to the console.\n\n• Use f-strings for formatting: \`f"Value: {x}"\`\n• Multiple values: \`print(a, b, c)\`\n\n💡 **Tip**: Use \`pprint\` for pretty-printing complex objects.`,
        'def': `⚡ **Function Definition (Python)**\nDefines a reusable function.\n\n• Use \`def\` keyword\n• Indent function body\n• \`return\` to send value back\n\n💡 **Tip**: Use type hints for better code: \`def func(x: int) -> str:\``,
    };

    // Find matching explanation
    for (const [keyword, explanation] of Object.entries(explanations)) {
        if (code.toLowerCase().includes(keyword)) {
            return { content: explanation, type: 'explanation' };
        }
    }

    const defaultExplanation = language === 'javascript'
        ? `📋 **Code Analysis**\n\nThis JavaScript code performs the following operations:\n\n1. Defines variables and data structures\n2. Processes logic based on conditions\n3. Produces output or side effects\n\n💡 **Tip**: Break complex code into smaller functions for better readability.`
        : `📋 **Code Analysis**\n\nThis Python code performs the following operations:\n\n1. Sets up variables and data structures\n2. Processes logic with control flow\n3. Produces output or returns results\n\n💡 **Tip**: Follow PEP 8 style guidelines for cleaner Python code.`;

    return { content: defaultExplanation, type: 'explanation' };
};

// Optimize code
export const optimizeCode = async (code: string, language: 'javascript' | 'python'): Promise<AIResponse> => {
    await simulateDelay(1000);

    const suggestions: string[] = [];

    if (language === 'javascript') {
        if (code.includes('var ')) {
            suggestions.push('• Replace `var` with `const` or `let` for block scoping');
        }
        if (code.includes('function(') && !code.includes('=>')) {
            suggestions.push('• Consider using arrow functions `() => {}` for shorter syntax');
        }
        if (code.includes('.then(')) {
            suggestions.push('• Convert Promise chains to `async/await` for cleaner code');
        }
        if (code.includes('for (let i')) {
            suggestions.push('• Use `forEach()`, `map()`, or `for...of` for cleaner iteration');
        }
        if (!code.includes('try')) {
            suggestions.push('• Add error handling with `try/catch` blocks');
        }
    } else {
        if (code.includes('range(len(')) {
            suggestions.push('• Use `enumerate()` instead of `range(len())` for cleaner loops');
        }
        if (code.includes('+ ') && code.includes('"')) {
            suggestions.push('• Use f-strings for string formatting: `f"text {variable}"`');
        }
        if (code.includes('== True') || code.includes('== False')) {
            suggestions.push('• Simplify boolean comparisons: use `if x:` instead of `if x == True:`');
        }
        if (!code.includes('try:')) {
            suggestions.push('• Add exception handling with `try/except` blocks');
        }
    }

    if (suggestions.length === 0) {
        suggestions.push('✅ Your code looks well-optimized!');
        suggestions.push('• Consider adding comments for complex logic');
        suggestions.push('• Ensure consistent naming conventions');
    }

    return {
        content: `🚀 **Optimization Suggestions**\n\n${suggestions.join('\n')}\n\n---\n*These are automated suggestions. Review each before applying.*`,
        type: 'optimization'
    };
};

// Convert between languages
export const convertCode = async (
    code: string,
    fromLang: 'javascript' | 'python',
    toLang: 'javascript' | 'python'
): Promise<AIResponse> => {
    await simulateDelay(1200);

    if (fromLang === toLang) {
        return { content: code, type: 'conversion' };
    }

    // Basic conversion patterns
    let converted = code;

    if (fromLang === 'javascript' && toLang === 'python') {
        converted = code
            .replace(/const |let |var /g, '')
            .replace(/;$/gm, '')
            .replace(/\{/g, ':')
            .replace(/\}/g, '')
            .replace(/===/g, '==')
            .replace(/!==/g, '!=')
            .replace(/console\.log\(/g, 'print(')
            .replace(/function (\w+)\((.*?)\)/g, 'def $1($2)')
            .replace(/\/\//g, '#')
            .replace(/true/g, 'True')
            .replace(/false/g, 'False')
            .replace(/null/g, 'None')
            .replace(/undefined/g, 'None')
            .replace(/\.length/g, ')')
            .replace(/\.push\(/g, '.append(')
            .replace(/\.forEach\((.*?) =>/g, 'for $1 in')
            .replace(/=>/g, ':');
    } else if (fromLang === 'python' && toLang === 'javascript') {
        converted = code
            .replace(/def (\w+)\((.*?)\):/g, 'function $1($2) {')
            .replace(/print\(/g, 'console.log(')
            .replace(/#/g, '//')
            .replace(/True/g, 'true')
            .replace(/False/g, 'false')
            .replace(/None/g, 'null')
            .replace(/elif/g, '} else if')
            .replace(/else:/g, '} else {')
            .replace(/:\s*$/gm, ' {')
            .replace(/\.append\(/g, '.push(')
            .replace(/for (\w+) in range\((\d+)\):/g, 'for (let $1 = 0; $1 < $2; $1++) {');
    }

    return {
        content: `🔄 **Converted to ${toLang === 'javascript' ? 'JavaScript' : 'Python'}**\n\n\`\`\`${toLang}\n${converted}\n\`\`\`\n\n⚠️ *This is an automated conversion. Please review and adjust as needed.*`,
        type: 'conversion'
    };
};

// Get suggestions for the current code
export const getSuggestions = async (code: string, language: 'javascript' | 'python'): Promise<AIResponse> => {
    await simulateDelay(600);

    const suggestions = [
        {
            icon: '💡',
            text: 'Consider adding input validation to prevent errors',
        },
        {
            icon: '🔒',
            text: 'Add error handling for edge cases',
        },
        {
            icon: '📝',
            text: 'Document your functions with comments',
        },
        {
            icon: '🎯',
            text: 'Break large functions into smaller, focused ones',
        },
    ];

    const randomSuggestions = suggestions
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

    return {
        content: `💡 **Suggestions**\n\n${randomSuggestions.map((s) => `${s.icon} ${s.text}`).join('\n')}`,
        type: 'suggestion'
    };
};

// Execute code (simulated)
export interface ExecutionResult {
    output: string[];
    error: string | null;
    variables: Record<string, unknown>;
}

export const executeCode = async (code: string, language: 'javascript' | 'python'): Promise<ExecutionResult> => {
    await simulateDelay(500);

    // Simulate execution output
    const output: string[] = [];
    const variables: Record<string, unknown> = {};

    // Extract console.log/print statements (very basic simulation)
    const printRegex = language === 'javascript'
        ? /console\.log\(["'`](.+?)["'`]\)/g
        : /print\(["'](.+?)["']\)/g;

    let match;
    while ((match = printRegex.exec(code)) !== null) {
        output.push(match[1]);
    }

    // Extract variables (basic simulation)
    const varRegex = language === 'javascript'
        ? /(?:const|let|var)\s+(\w+)\s*=\s*(.+?);/g
        : /(\w+)\s*=\s*(.+?)$/gm;

    while ((match = varRegex.exec(code)) !== null) {
        try {
            variables[match[1]] = match[2].trim();
        } catch {
            // Ignore parsing errors
        }
    }

    if (output.length === 0) {
        output.push('Program executed successfully.');
    }

    return { output, error: null, variables };
};
