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
    Code2,
    Layout,
    Server,
    FileJson,
    Cpu,
    Layers,
    Terminal,
    FolderOpen,
    Play,
    ArrowRight,
    Hash,
    FileText,
} from 'lucide-react';

// Supported Languages for Code Generation
export type Language =
    | 'javascript'
    | 'python'
    | 'typescript'
    | 'java'
    | 'c'
    | 'cpp'
    | 'ruby'
    | 'sql'
    | 'html'
    | 'css';

// High-level Block Groups
export const BLOCK_GROUPS = {
    programming: {
        name: 'Programming',
        categories: ['python', 'javascript', 'typescript', 'java', 'c', 'cpp', 'ruby'],
        icon: Terminal,
    },
    databases: {
        name: 'Databases',
        categories: ['mysql', 'postgres', 'mongodb', 'redis'],
        icon: Database,
    },
    ui: {
        name: 'UI / Frontend',
        categories: ['html', 'css', 'react', 'vue', 'angular'],
        icon: Layout,
    },
    logic: {
        name: 'Logic',
        categories: ['logic'],
        icon: GitBranch,
    },
    control: {
        name: 'Control Flow',
        categories: ['control'],
        icon: RotateCw,
    },
    api: {
        name: 'API & Network',
        categories: ['api'],
        icon: Globe,
    },
    data: {
        name: 'Data Structures',
        categories: ['data'],
        icon: Box,
    },
    filesystem: {
        name: 'Filesystem',
        categories: ['filesystem'],
        icon: FolderOpen,
    },
} as const;

export type BlockGroupKey = keyof typeof BLOCK_GROUPS;

// Granular Categories
export const BLOCK_CATEGORIES = {
    // Programming Languages
    python: { name: 'Python', color: '#00FF85', bgColor: 'rgba(0, 255, 133, 0.2)' },
    javascript: { name: 'JavaScript', color: '#F7DF1E', bgColor: 'rgba(247, 223, 30, 0.2)' },
    typescript: { name: 'TypeScript', color: '#3178C6', bgColor: 'rgba(49, 120, 198, 0.2)' },
    java: { name: 'Java', color: '#FF6B00', bgColor: 'rgba(255, 107, 0, 0.2)' },
    c: { name: 'C', color: '#005CFF', bgColor: 'rgba(0, 92, 255, 0.2)' },
    cpp: { name: 'C++', color: '#0044AA', bgColor: 'rgba(0, 68, 170, 0.2)' },
    ruby: { name: 'Ruby', color: '#CC0000', bgColor: 'rgba(204, 0, 0, 0.2)' },

    // Databases
    mysql: { name: 'MySQL', color: '#00618A', bgColor: 'rgba(0, 97, 138, 0.2)' },
    postgres: { name: 'PostgreSQL', color: '#336791', bgColor: 'rgba(51, 103, 145, 0.2)' },
    mongodb: { name: 'MongoDB', color: '#4DB33D', bgColor: 'rgba(77, 179, 61, 0.2)' },
    redis: { name: 'Redis', color: '#DC382D', bgColor: 'rgba(220, 56, 45, 0.2)' },

    // UI
    html: { name: 'HTML', color: '#E34F26', bgColor: 'rgba(227, 79, 38, 0.2)' },
    css: { name: 'CSS', color: '#1572B6', bgColor: 'rgba(21, 114, 182, 0.2)' },
    react: { name: 'React', color: '#61DAFB', bgColor: 'rgba(97, 218, 251, 0.2)' },
    vue: { name: 'Vue', color: '#4FC08D', bgColor: 'rgba(79, 192, 141, 0.2)' },
    angular: { name: 'Angular', color: '#DD0031', bgColor: 'rgba(221, 0, 49, 0.2)' },

    // Core
    logic: { name: 'Logic', color: '#8A2BE2', bgColor: 'rgba(138, 43, 226, 0.2)' },
    control: { name: 'Control Flow', color: '#0080FF', bgColor: 'rgba(0, 128, 255, 0.2)' },
    api: { name: 'API', color: '#FFD700', bgColor: 'rgba(255, 215, 0, 0.2)' },
    data: { name: 'Data', color: '#FF1493', bgColor: 'rgba(255, 20, 147, 0.2)' },
    filesystem: { name: 'Filesystem', color: '#E2E8F0', bgColor: 'rgba(226, 232, 240, 0.2)' },
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
    codeTemplates: Partial<Record<Language, (params: Record<string, string>) => string>>;
}

// Helper for default templates
const defaultTemplates = (js: string, py: string) => ({
    javascript: (p: any) => js.replace(/\${(\w+)}/g, (_, k) => p[k] || ''),
    python: (p: any) => py.replace(/\${(\w+)}/g, (_, k) => p[k] || ''),
    typescript: (p: any) => js.replace(/\${(\w+)}/g, (_, k) => p[k] || ''),
    java: (p: any) => `// Java implementation for ${js.substring(0, 20)}...`,
    c: (p: any) => `// C implementation`,
    cpp: (p: any) => `// C++ implementation`,
    ruby: (p: any) => `# Ruby implementation`,
});

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
        codeTemplates: {
            javascript: (p) => `if (${p.condition || 'condition'}) {\n  // true branch\n} else {\n  // false branch\n}`,
            python: (p) => `if ${p.condition || 'condition'}:\n    # true branch\nelse:\n    # false branch`,
            java: (p) => `if (${p.condition || 'condition'}) {\n    // true branch\n} else {\n    // false branch\n}`,
            c: (p) => `if (${p.condition || 'condition'}) {\n    // true branch\n} else {\n    // false branch\n}`,
            cpp: (p) => `if (${p.condition || 'condition'}) {\n    // true branch\n} else {\n    // false branch\n}`,
            ruby: (p) => `if ${p.condition || 'condition'}\n  # true branch\nelse\n  # false branch\nend`,
        }
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
        codeTemplates: {
            javascript: (p) => `function ${p.name || 'myFunction'}(${p.params || ''}) {\n  // function body\n  return result;\n}`,
            python: (p) => `def ${p.name || 'my_function'}(${p.params || ''}):\n    # function body\n    return result`,
            java: (p) => `public void ${p.name || 'myFunction'}(${p.params || ''}) {\n    // function body\n}`,
            c: (p) => `void ${p.name || 'myFunction'}(${p.params || ''}) {\n    // function body\n}`,
            cpp: (p) => `void ${p.name || 'myFunction'}(${p.params || ''}) {\n    // function body\n}`,
            ruby: (p) => `def ${p.name || 'my_function'}(${p.params || ''})\n  # function body\nend`,
        }
    },

    // === CONTROL FLOW ===
    {
        id: 'loop',
        type: 'loop',
        name: 'For Loop',
        category: 'control',
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
        codeTemplates: {
            javascript: (p) => `for (let i = 0; i < ${p.count || '10'}; i++) {\n  // loop body\n}`,
            python: (p) => `for i in range(${p.count || '10'}):\n    # loop body`,
            java: (p) => `for (int i = 0; i < ${p.count || '10'}; i++) {\n    // loop body\n}`,
            c: (p) => `for (int i = 0; i < ${p.count || '10'}; i++) {\n    // loop body\n}`,
            cpp: (p) => `for (int i = 0; i < ${p.count || '10'}; i++) {\n    // loop body\n}`,
            ruby: (p) => `${p.count || '10'}.times do |i|\n  # loop body\nend`,
        }
    },
    {
        id: 'while-loop',
        type: 'while-loop',
        name: 'While Loop',
        category: 'control',
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
        codeTemplates: {
            javascript: (p) => `while (${p.condition || 'condition'}) {\n  // loop body\n}`,
            python: (p) => `while ${p.condition || 'condition'}:\n    # loop body`,
            java: (p) => `while (${p.condition || 'condition'}) {\n    // loop body\n}`,
            c: (p) => `while (${p.condition || 'condition'}) {\n    // loop body\n}`,
            cpp: (p) => `while (${p.condition || 'condition'}) {\n    // loop body\n}`,
            ruby: (p) => `while ${p.condition || 'condition'}\n  # loop body\nend`,
        }
    },
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
        codeTemplates: {
            javascript: () => `// Program Start`,
            python: () => `# Program Start`,
            java: () => `// Program Start`,
            c: () => `// Program Start`,
            cpp: () => `// Program Start`,
            ruby: () => `# Program Start`,
        }
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
        codeTemplates: {
            javascript: () => `// Program End`,
            python: () => `# Program End`,
            java: () => `// Program End`,
            c: () => `// Program End`,
            cpp: () => `// Program End`,
            ruby: () => `# Program End`,
        }
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
        codeTemplates: {
            javascript: (p) => `const ${p.name || 'myVar'} = ${p.value || 'null'};`,
            python: (p) => `${p.name || 'my_var'} = ${p.value || 'None'}`,
            java: (p) => `var ${p.name || 'myVar'} = ${p.value || 'null'};`,
            c: (p) => `int ${p.name || 'myVar'} = ${p.value || '0'};`,
            cpp: (p) => `auto ${p.name || 'myVar'} = ${p.value || 'nullptr'};`,
            ruby: (p) => `${p.name || 'my_var'} = ${p.value || 'nil'}`,
        }
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
        codeTemplates: {
            javascript: (p) => `const items = ${p.items || '[]'};`,
            python: (p) => `items = ${p.items || '[]'}`,
            java: (p) => `List<Object> items = new ArrayList<>(${p.items || ''});`,
            c: (p) => `int items[] = {${p.items || ''}};`,
            cpp: (p) => `std::vector<int> items = {${p.items || ''}};`,
            ruby: (p) => `items = [${p.items || ''}]`,
        }
    },
    {
        id: 'print',
        type: 'print',
        name: 'Print',
        category: 'python', // Also used generally
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
        codeTemplates: {
            javascript: (p) => `console.log(${p.value || '"Hello, World!"'});`,
            python: (p) => `print(${p.value || '"Hello, World!"'})`,
            java: (p) => `System.out.println(${p.value || '"Hello, World!"'});`,
            c: (p) => `printf("%s\\n", ${p.value || '"Hello, World!"'});`,
            cpp: (p) => `std::cout << ${p.value || '"Hello, World!"'} << std::endl;`,
            ruby: (p) => `puts ${p.value || '"Hello, World!"'}`,
        }
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
        codeTemplates: {
            javascript: (p) => `const response = await fetch("${p.url || 'https://api.example.com/data'}");\nconst data = await response.json();`,
            python: (p) => `import requests\nresponse = requests.get("${p.url || 'https://api.example.com/data'}")\ndata = response.json()`,
            java: (p) => `// Requires HttpClient\nHttpClient client = HttpClient.newHttpClient();\nHttpRequest request = HttpRequest.newBuilder().uri(URI.create("${p.url}")).build();`,
        }
    },

    // === FILESYSTEM ===
    {
        id: 'file-read',
        type: 'file-read',
        name: 'File Read',
        category: 'filesystem',
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
        codeTemplates: {
            javascript: (p) => `const fs = require('fs');\nconst content = fs.readFileSync("${p.path || 'file.txt'}", 'utf-8');`,
            python: (p) => `with open("${p.path || 'file.txt'}", 'r') as f:\n    content = f.read()`,
            java: (p) => `String content = Files.readString(Path.of("${p.path || 'file.txt'}"));`,
            c: (p) => `FILE *f = fopen("${p.path || 'file.txt'}", "r");`,
            cpp: (p) => `std::ifstream f("${p.path || 'file.txt'}");`,
            ruby: (p) => `content = File.read("${p.path || 'file.txt'}")`,
        }
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
