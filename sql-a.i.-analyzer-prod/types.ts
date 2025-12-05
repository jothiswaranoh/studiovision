
export interface TableColumn {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
}

export interface TableNode {
  id: string;
  name: string;
  alias?: string;
  columns: TableColumn[];
  position?: { x: number; y: number };
  type?: 'TABLE' | 'CTE' | 'SUBQUERY';
}

export interface Relationship {
  id: string;
  sourceTable: string;
  targetTable: string;
  sourceColumn: string;
  targetColumn: string;
  type: 'INNER JOIN' | 'LEFT JOIN' | 'RIGHT JOIN' | 'FULL JOIN' | 'CROSS JOIN' | 'IMPLICIT';
  condition: string;
}

export interface ExecutionStep {
  stepId: number;
  operation: string;
  description: string;
  explanation?: string;
  resultData: Record<string, any>[];
}

export interface FlowchartNode {
  id: string;
  type: string; 
  // Standard: 'TABLE', 'SELECT', 'WHERE', 'JOIN', 'GROUP_BY', 'UPDATE', 'INSERT'
  // Advanced: 'CTE', 'SUBQUERY', 'CREATE', 'ALTER', 'DROP', 'GRANT', 'REVOKE', 'COMMIT', 'ROLLBACK'
  label: string;
  stepId?: number;
  columns?: TableColumn[]; // Optional: specifically for TABLE type nodes
  x?: number; // Persistent X position
  y?: number; // Persistent Y position
  data?: any; // Generic data holder
}

export interface FlowchartEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  selected?: boolean;
}

export interface VisualFlow {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
}

export interface AnalysisResult {
  tables: TableNode[];
  relationships: Relationship[];
  functions: string[];
  complexityScore: number;
  summary: string;
  executionPlan: ExecutionStep[];
  visualFlow?: VisualFlow;
  queryType?: string;
  involvedTables?: any[];
}

export interface MockDatabase {
  [key: string]: {
    name: string;
    schema: {
      name: string;
      type: string;
      isPrimaryKey?: boolean;
      isForeignKey?: boolean;
    }[];
    data: Record<string, any>[];
  };
}
