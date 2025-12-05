import { LucideIcon } from 'lucide-react';
import {
    Box,
    GitBranch,
    RotateCw,
    Zap,
    Variable,
    List,
    Database,
    Type,
    Image,
    Square,
    Globe,
    Send,
    Printer,
    Hash,
    FileText,
    FolderOpen,
    Play,
    ArrowRight,
} from 'lucide-react';

// Block categories with their colors
export const BLOCK_CATEGORIES = {
    logic: { name: 'Logic', color: '#8A2BE2', bgColor: 'rgba(138, 43, 226, 0.2)' },
    data: { name: 'Data', color: '#00FFFF', bgColor: 'rgba(0, 255, 255, 0.2)' },
    ui: { name: 'UI (React)', color: '#FF1493', bgColor: 'rgba(255, 20, 147, 0.2)' },
    api: { name: 'API', color: '#FFD700', bgColor: 'rgba(255, 215, 0, 0.2)' },
    python: { name: 'Python', color: '#00FF85', bgColor: 'rgba(0, 255, 133, 0.2)' },
    control: { name: 'Control Flow', color: '#0080FF', bgColor: 'rgba(0, 128, 255, 0.2)' },
} as const;

export type BlockCategory = keyof typeof BLOCK_CATEGORIES;

// Port types for connections
export type PortType = 'input' | 'output' | 'flow-in' | 'flow-out';

export interface Port {
    id: string;
    type: PortType;
    dataType: 'any' | 'number' | 'string' | 'boolean' | 'array' | 'object' | 'flow';
    label?: string;
}

// Block definition interface
export interface BlockDefinition {
    id: string;
    type: string;
    name: string;
    category: BlockCategory;
    icon: LucideIcon;
    description: string;
    inputs: Port[];
    outputs: Port[];
    defaultValue?: Record<string, unknown>;
    codeTemplateJS: (params: Record<string, string>) => string;
    codeTemplatePython: (params: Record<string, string>) => string;
}

// All block definitions
export const BLOCK_DEFINITIONS: BlockDefinition[] = [
    // === LOGIC BLOCKS ===
    {
        id: 'if-else',
        type: 'if-else',
        name: 'If / Else',
        category: 'logic',
        icon: GitBranch,
        description: 'Conditional branching based on a condition',
        inputs: [
            { id: 'flow-in', type: 'flow-in', dataType: 'flow', label: 'In' },
            { id: 'condition', type: 'input', dataType: 'boolean', label: 'Condition' },
        ],
        outputs: [
            { id: 'flow-true', type: 'flow-out', dataType: 'flow', label: 'True' },
            { id: 'flow-false', type: 'flow-out', dataType: 'flow', label: 'False' },
        ],
        codeTemplateJS: (p) => `if (${p.condition || 'condition'}) {\n  // true branch\n} else {\n  // false branch\n}`,
        codeTemplatePython: (p) => `if ${p.condition || 'condition'}:\n    # true branch\nelse:\n    # false branch`,
    },
    {
        id: 'loop',
        type: 'loop',
        name: 'For Loop',
        category: 'logic',
        icon: RotateCw,
        description: 'Repeat actions for a specified number of times',
        inputs: [
            { id: 'flow-in', type: 'flow-in', dataType: 'flow', label: 'In' },
            { id: 'count', type: 'input', dataType: 'number', label: 'Count' },
        ],
        outputs: [
            { id: 'flow-body', type: 'flow-out', dataType: 'flow', label: 'Body' },
            { id: 'flow-done', type: 'flow-out', dataType: 'flow', label: 'Done' },
            { id: 'index', type: 'output', dataType: 'number', label: 'Index' },
        ],
        defaultValue: { count: '10' },
        codeTemplateJS: (p) => `for (let i = 0; i < ${p.count || '10'}; i++) {\n  // loop body\n}`,
        codeTemplatePython: (p) => `for i in range(${p.count || '10'}):\n    # loop body`,
    },
    {
        id: 'function',
        type: 'function',
        name: 'Function',
        category: 'logic',
        icon: Zap,
        description: 'Define a reusable function',
        inputs: [
            { id: 'params', type: 'input', dataType: 'any', label: 'Parameters' },
        ],
        outputs: [
            { id: 'flow-body', type: 'flow-out', dataType: 'flow', label: 'Body' },
            { id: 'return', type: 'output', dataType: 'any', label: 'Return' },
        ],
        defaultValue: { name: 'myFunction', params: '' },
        codeTemplateJS: (p) => `function ${p.name || 'myFunction'}(${p.params || ''}) {\n  // function body\n  return result;\n}`,
        codeTemplatePython: (p) => `def ${p.name || 'my_function'}(${p.params || ''}):\n    # function body\n    return result`,
    },
    {
        id: 'while-loop',
        type: 'while-loop',
        name: 'While Loop',
        category: 'logic',
        icon: RotateCw,
        description: 'Repeat while condition is true',
        inputs: [
            { id: 'flow-in', type: 'flow-in', dataType: 'flow', label: 'In' },
            { id: 'condition', type: 'input', dataType: 'boolean', label: 'Condition' },
        ],
        outputs: [
            { id: 'flow-body', type: 'flow-out', dataType: 'flow', label: 'Body' },
            { id: 'flow-done', type: 'flow-out', dataType: 'flow', label: 'Done' },
        ],
        codeTemplateJS: (p) => `while (${p.condition || 'condition'}) {\n  // loop body\n}`,
        codeTemplatePython: (p) => `while ${p.condition || 'condition'}:\n    # loop body`,
    },

    // === DATA BLOCKS ===
    {
        id: 'variable',
        type: 'variable',
        name: 'Variable',
        category: 'data',
        icon: Variable,
        description: 'Declare and assign a variable',
        inputs: [
            { id: 'value', type: 'input', dataType: 'any', label: 'Value' },
        ],
        outputs: [
            { id: 'variable', type: 'output', dataType: 'any', label: 'Variable' },
        ],
        defaultValue: { name: 'myVar', value: '' },
        codeTemplateJS: (p) => `const ${p.name || 'myVar'} = ${p.value || 'null'};`,
        codeTemplatePython: (p) => `${p.name || 'my_var'} = ${p.value || 'None'}`,
    },
    {
        id: 'array',
        type: 'array',
        name: 'Array / List',
        category: 'data',
        icon: List,
        description: 'Create an array or list of items',
        inputs: [
            { id: 'items', type: 'input', dataType: 'any', label: 'Items' },
        ],
        outputs: [
            { id: 'array', type: 'output', dataType: 'array', label: 'Array' },
        ],
        defaultValue: { items: '[]' },
        codeTemplateJS: (p) => `const items = ${p.items || '[]'};`,
        codeTemplatePython: (p) => `items = ${p.items || '[]'}`,
    },
    {
        id: 'object',
        type: 'object',
        name: 'Object / Dict',
        category: 'data',
        icon: Database,
        description: 'Create an object or dictionary',
        inputs: [],
        outputs: [
            { id: 'object', type: 'output', dataType: 'object', label: 'Object' },
        ],
        defaultValue: { data: '{}' },
        codeTemplateJS: (p) => `const data = ${p.data || '{}'};`,
        codeTemplatePython: (p) => `data = ${p.data || '{}'}`,
    },
    {
        id: 'input',
        type: 'input',
        name: 'User Input',
        category: 'data',
        icon: Box,
        description: 'Get input from user',
        inputs: [
            { id: 'prompt', type: 'input', dataType: 'string', label: 'Prompt' },
        ],
        outputs: [
            { id: 'value', type: 'output', dataType: 'string', label: 'Value' },
        ],
        defaultValue: { prompt: 'Enter value:' },
        codeTemplateJS: (p) => `const userInput = prompt("${p.prompt || 'Enter value:'}");`,
        codeTemplatePython: (p) => `user_input = input("${p.prompt || 'Enter value:'}")`,
    },

    // === UI BLOCKS (React) ===
    {
        id: 'button',
        type: 'button',
        name: 'Button',
        category: 'ui',
        icon: Square,
        description: 'Create a clickable button component',
        inputs: [
            { id: 'text', type: 'input', dataType: 'string', label: 'Text' },
            { id: 'onClick', type: 'input', dataType: 'any', label: 'onClick' },
        ],
        outputs: [
            { id: 'component', type: 'output', dataType: 'any', label: 'Component' },
        ],
        defaultValue: { text: 'Click Me' },
        codeTemplateJS: (p) => `<button onClick={${p.onClick || 'handleClick'}}>${p.text || 'Click Me'}</button>`,
        codeTemplatePython: (p) => `# Python: Use tkinter\nimport tkinter as tk\nbutton = tk.Button(text="${p.text || 'Click Me'}")`,
    },
    {
        id: 'text',
        type: 'text',
        name: 'Text',
        category: 'ui',
        icon: Type,
        description: 'Display text content',
        inputs: [
            { id: 'content', type: 'input', dataType: 'string', label: 'Content' },
        ],
        outputs: [
            { id: 'component', type: 'output', dataType: 'any', label: 'Component' },
        ],
        defaultValue: { content: 'Hello World' },
        codeTemplateJS: (p) => `<p>${p.content || 'Hello World'}</p>`,
        codeTemplatePython: (p) => `print("${p.content || 'Hello World'}")`,
    },
    {
        id: 'image',
        type: 'image',
        name: 'Image',
        category: 'ui',
        icon: Image,
        description: 'Display an image',
        inputs: [
            { id: 'src', type: 'input', dataType: 'string', label: 'Source' },
            { id: 'alt', type: 'input', dataType: 'string', label: 'Alt Text' },
        ],
        outputs: [
            { id: 'component', type: 'output', dataType: 'any', label: 'Component' },
        ],
        defaultValue: { src: '', alt: 'Image' },
        codeTemplateJS: (p) => `<img src="${p.src || ''}" alt="${p.alt || 'Image'}" />`,
        codeTemplatePython: (p) => `# Python: Use PIL\nfrom PIL import Image\nimg = Image.open("${p.src || 'image.png'}")`,
    },
    {
        id: 'card',
        type: 'card',
        name: 'Card',
        category: 'ui',
        icon: Square,
        description: 'A card container component',
        inputs: [
            { id: 'title', type: 'input', dataType: 'string', label: 'Title' },
            { id: 'content', type: 'input', dataType: 'any', label: 'Content' },
        ],
        outputs: [
            { id: 'component', type: 'output', dataType: 'any', label: 'Component' },
        ],
        defaultValue: { title: 'Card Title' },
        codeTemplateJS: (p) => `<div className="card">\n  <h3>${p.title || 'Card Title'}</h3>\n  {children}\n</div>`,
        codeTemplatePython: (p) => `# Card component (conceptual)\ncard = {"title": "${p.title || 'Card Title'}", "content": content}`,
    },

    // === API BLOCKS ===
    {
        id: 'fetch-get',
        type: 'fetch-get',
        name: 'HTTP GET',
        category: 'api',
        icon: Globe,
        description: 'Make a GET request to an API',
        inputs: [
            { id: 'flow-in', type: 'flow-in', dataType: 'flow', label: 'In' },
            { id: 'url', type: 'input', dataType: 'string', label: 'URL' },
        ],
        outputs: [
            { id: 'flow-out', type: 'flow-out', dataType: 'flow', label: 'Out' },
            { id: 'data', type: 'output', dataType: 'any', label: 'Data' },
            { id: 'error', type: 'output', dataType: 'any', label: 'Error' },
        ],
        defaultValue: { url: 'https://api.example.com/data' },
        codeTemplateJS: (p) => `const response = await fetch("${p.url || 'https://api.example.com/data'}");\nconst data = await response.json();`,
        codeTemplatePython: (p) => `import requests\nresponse = requests.get("${p.url || 'https://api.example.com/data'}")\ndata = response.json()`,
    },
    {
        id: 'fetch-post',
        type: 'fetch-post',
        name: 'HTTP POST',
        category: 'api',
        icon: Send,
        description: 'Make a POST request to an API',
        inputs: [
            { id: 'flow-in', type: 'flow-in', dataType: 'flow', label: 'In' },
            { id: 'url', type: 'input', dataType: 'string', label: 'URL' },
            { id: 'body', type: 'input', dataType: 'object', label: 'Body' },
        ],
        outputs: [
            { id: 'flow-out', type: 'flow-out', dataType: 'flow', label: 'Out' },
            { id: 'data', type: 'output', dataType: 'any', label: 'Data' },
        ],
        defaultValue: { url: 'https://api.example.com/data', body: '{}' },
        codeTemplateJS: (p) => `const response = await fetch("${p.url || 'https://api.example.com/data'}", {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify(${p.body || '{}'})\n});\nconst data = await response.json();`,
        codeTemplatePython: (p) => `import requests\nresponse = requests.post("${p.url || 'https://api.example.com/data'}", json=${p.body || '{}'})\ndata = response.json()`,
    },
    {
        id: 'axios-get',
        type: 'axios-get',
        name: 'Axios GET',
        category: 'api',
        icon: Globe,
        description: 'Make a GET request using Axios',
        inputs: [
            { id: 'flow-in', type: 'flow-in', dataType: 'flow', label: 'In' },
            { id: 'url', type: 'input', dataType: 'string', label: 'URL' },
        ],
        outputs: [
            { id: 'flow-out', type: 'flow-out', dataType: 'flow', label: 'Out' },
            { id: 'data', type: 'output', dataType: 'any', label: 'Data' },
        ],
        defaultValue: { url: 'https://api.example.com/data' },
        codeTemplateJS: (p) => `const { data } = await axios.get("${p.url || 'https://api.example.com/data'}");`,
        codeTemplatePython: (p) => `# Use requests in Python\nimport requests\nresponse = requests.get("${p.url || 'https://api.example.com/data'}")\ndata = response.json()`,
    },

    // === PYTHON BLOCKS ===
    {
        id: 'print',
        type: 'print',
        name: 'Print',
        category: 'python',
        icon: Printer,
        description: 'Print output to console',
        inputs: [
            { id: 'flow-in', type: 'flow-in', dataType: 'flow', label: 'In' },
            { id: 'value', type: 'input', dataType: 'any', label: 'Value' },
        ],
        outputs: [
            { id: 'flow-out', type: 'flow-out', dataType: 'flow', label: 'Out' },
        ],
        defaultValue: { value: '"Hello, World!"' },
        codeTemplateJS: (p) => `console.log(${p.value || '"Hello, World!"'});`,
        codeTemplatePython: (p) => `print(${p.value || '"Hello, World!"'})`,
    },
    {
        id: 'range',
        type: 'range',
        name: 'Range',
        category: 'python',
        icon: Hash,
        description: 'Generate a range of numbers',
        inputs: [
            { id: 'start', type: 'input', dataType: 'number', label: 'Start' },
            { id: 'end', type: 'input', dataType: 'number', label: 'End' },
        ],
        outputs: [
            { id: 'range', type: 'output', dataType: 'array', label: 'Range' },
        ],
        defaultValue: { start: '0', end: '10' },
        codeTemplateJS: (p) => `const range = Array.from({ length: ${p.end || '10'} - ${p.start || '0'} }, (_, i) => i + ${p.start || '0'});`,
        codeTemplatePython: (p) => `numbers = list(range(${p.start || '0'}, ${p.end || '10'}))`,
    },
    {
        id: 'list-append',
        type: 'list-append',
        name: 'List Append',
        category: 'python',
        icon: List,
        description: 'Add item to a list',
        inputs: [
            { id: 'flow-in', type: 'flow-in', dataType: 'flow', label: 'In' },
            { id: 'list', type: 'input', dataType: 'array', label: 'List' },
            { id: 'item', type: 'input', dataType: 'any', label: 'Item' },
        ],
        outputs: [
            { id: 'flow-out', type: 'flow-out', dataType: 'flow', label: 'Out' },
            { id: 'list', type: 'output', dataType: 'array', label: 'List' },
        ],
        defaultValue: { list: 'myList', item: 'newItem' },
        codeTemplateJS: (p) => `${p.list || 'myList'}.push(${p.item || 'newItem'});`,
        codeTemplatePython: (p) => `${p.list || 'my_list'}.append(${p.item || 'new_item'})`,
    },
    {
        id: 'file-read',
        type: 'file-read',
        name: 'File Read',
        category: 'python',
        icon: FileText,
        description: 'Read contents from a file',
        inputs: [
            { id: 'flow-in', type: 'flow-in', dataType: 'flow', label: 'In' },
            { id: 'path', type: 'input', dataType: 'string', label: 'Path' },
        ],
        outputs: [
            { id: 'flow-out', type: 'flow-out', dataType: 'flow', label: 'Out' },
            { id: 'content', type: 'output', dataType: 'string', label: 'Content' },
        ],
        defaultValue: { path: 'file.txt' },
        codeTemplateJS: (p) => `const fs = require('fs');\nconst content = fs.readFileSync("${p.path || 'file.txt'}", 'utf-8');`,
        codeTemplatePython: (p) => `with open("${p.path || 'file.txt'}", 'r') as f:\n    content = f.read()`,
    },
    {
        id: 'file-write',
        type: 'file-write',
        name: 'File Write',
        category: 'python',
        icon: FolderOpen,
        description: 'Write contents to a file',
        inputs: [
            { id: 'flow-in', type: 'flow-in', dataType: 'flow', label: 'In' },
            { id: 'path', type: 'input', dataType: 'string', label: 'Path' },
            { id: 'content', type: 'input', dataType: 'string', label: 'Content' },
        ],
        outputs: [
            { id: 'flow-out', type: 'flow-out', dataType: 'flow', label: 'Out' },
        ],
        defaultValue: { path: 'output.txt', content: '"Hello, File!"' },
        codeTemplateJS: (p) => `const fs = require('fs');\nfs.writeFileSync("${p.path || 'output.txt'}", ${p.content || '"Hello, File!"'});`,
        codeTemplatePython: (p) => `with open("${p.path || 'output.txt'}", 'w') as f:\n    f.write(${p.content || '"Hello, File!"'})`,
    },

    // === CONTROL FLOW ===
    {
        id: 'start',
        type: 'start',
        name: 'Start',
        category: 'control',
        icon: Play,
        description: 'Program entry point',
        inputs: [],
        outputs: [
            { id: 'flow-out', type: 'flow-out', dataType: 'flow', label: 'Start' },
        ],
        codeTemplateJS: () => `// Program Start`,
        codeTemplatePython: () => `# Program Start`,
    },
    {
        id: 'end',
        type: 'end',
        name: 'End',
        category: 'control',
        icon: ArrowRight,
        description: 'Program end point',
        inputs: [
            { id: 'flow-in', type: 'flow-in', dataType: 'flow', label: 'End' },
        ],
        outputs: [],
        codeTemplateJS: () => `// Program End`,
        codeTemplatePython: () => `# Program End`,
    },
];

// Helper to get block by type
export const getBlockDefinition = (type: string): BlockDefinition | undefined => {
    return BLOCK_DEFINITIONS.find((b) => b.type === type);
};

// Get blocks by category
export const getBlocksByCategory = (category: BlockCategory): BlockDefinition[] => {
    return BLOCK_DEFINITIONS.filter((b) => b.category === category);
};

// Export all categories with their blocks
export const CATEGORIZED_BLOCKS = Object.keys(BLOCK_CATEGORIES).reduce((acc, cat) => {
    acc[cat as BlockCategory] = getBlocksByCategory(cat as BlockCategory);
    return acc;
}, {} as Record<BlockCategory, BlockDefinition[]>);
