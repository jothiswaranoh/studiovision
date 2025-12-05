
import { GoogleGenAI } from "@google/genai";
import { mockDb } from '../data/mockDb';
import { AnalysisResult } from '../types';

const SYSTEM_INSTRUCTION = `
You are an advanced SQL Visualization & Simulation Engine.
Your goal is to parse SQL queries and return a structured JSON response that allows for:
1. Visualizing the Schema AND Query Flow (Tables -> Joins -> Filters -> Select).
2. Simulating the Data Execution.

The user will provide:
1. Database Context (Mock Data).
2. SQL Query.

You MUST return a JSON object with this structure:
{
  "tables": [
    { "id": "t1", "name": "users", "alias": "u", "columns": [{ "name": "id", "type": "INT", "isPrimary": true }] }
  ],
  "relationships": [
    { "id": "r1", "sourceTable": "t1", "targetTable": "t2", "sourceColumn": "id", "targetColumn": "user_id", "type": "INNER JOIN", "condition": "u.id = o.user_id" }
  ],
  "visualFlow": {
    "nodes": [
        { "id": "t1", "type": "TABLE", "label": "users", "columns": [{ "name": "id", "type": "INT" }] },
        { "id": "op1", "type": "WHERE", "label": "total > 100" },
        { "id": "op2", "type": "SELECT", "label": "SELECT id, name" }
    ],
    "edges": [
        { "id": "e1", "source": "t1", "target": "op1" },
        { "id": "e2", "source": "op1", "target": "op2" }
    ]
  },
  "functions": ["COUNT", "DATE_TRUNC"],
  "complexityScore": 5,
  "summary": "Brief explanation.",
  "executionPlan": [
    {
      "stepId": 1,
      "operation": "LOAD users",
      "description": "Load data from users table",
      "resultData": [{ "id": 1, "name": "Alice" }] 
    }
  ]
}

RULES for "visualFlow":
- Create a node for every TABLE used. Type MUST be "TABLE". Include columns in "columns" property for TABLE nodes.
- Create nodes for operations: "SELECT", "FROM", "JOIN", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP", "CTE", "SUBQUERY", "COMMIT", "ROLLBACK".
- Connect them logically (e.g., Table -> Join -> Where -> Group By -> Select).
- Labels should be short and descriptive (e.g., "u.id = o.uid" for JOIN).

Output ONLY valid JSON.
`;

const cleanJson = (text: string): string => {
  const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonBlockMatch && jsonBlockMatch[1]) {
    return jsonBlockMatch[1].trim();
  }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.substring(firstBrace, lastBrace + 1);
  }
  return text.trim();
};

import yaml from 'js-yaml';

// ... other imports ...

// Helper to fetch config
const fetchConfig = async (): Promise<{ apiKey: string; model: string }> => {
  try {
    const res = await fetch('/config.yaml');
    if (!res.ok) throw new Error('Failed to load config.yaml');
    const text = await res.text();
    const config = yaml.load(text) as any;
    if (!config?.gemini?.apiKey) throw new Error('API Key not found in config.yaml');
    return {
      apiKey: config.gemini.apiKey,
      model: config.gemini.model || 'gemini-1.5-flash'
    };
  } catch (e) {
    console.error("Config Error:", e);
    throw new Error(`Configuration Error: ${e instanceof Error ? e.message : 'Could not load settings'}`);
  }
};

export const analyzeSql = async (query: string, type: 'QUERY' | 'PROCEDURE' | 'FUNCTION' = 'QUERY'): Promise<AnalysisResult> => {
  const { apiKey, model } = await fetchConfig();

  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    throw new Error("Please configure your API Key in public/config.yaml");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const dbContext = JSON.stringify(mockDb);

    // Dynamic instructions based on type
    let instruction = SYSTEM_INSTRUCTION;
    if (type !== 'QUERY') {
      instruction += `\n\nIMPORTANT: The user input is a ${type}. 
        - Visual Flow: Represent the control flow (IF/ELSE, LOOPS) and DML operations.
        - Execution Plan: Simulate step-by-step execution.
        - For SPs/Functions, include 'Action Type' (UPDATE, INSERT, EXECUTE) and 'Object' in step descriptions.
        `;
    }

    const prompt = `
          Database Context: ${dbContext}
          User Input Type: ${type}
          User SQL: ${query}
        `;

    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: instruction,
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const cleanedText = cleanJson(text);
    const parsed = JSON.parse(cleanedText);

    // Normalize Data
    return {
      tables: Array.isArray(parsed.tables) ? parsed.tables : [],
      relationships: Array.isArray(parsed.relationships) ? parsed.relationships : [],
      functions: Array.isArray(parsed.functions) ? parsed.functions : [],
      complexityScore: typeof parsed.complexityScore === 'number' ? parsed.complexityScore : 0,
      summary: parsed.summary || "No summary provided.",
      executionPlan: Array.isArray(parsed.executionPlan) ? parsed.executionPlan : [],
      visualFlow: parsed.visualFlow || { nodes: [], edges: [] }
    };

  } catch (error) {
    console.error("Analysis Failed", error);
    throw new Error(error instanceof Error ? error.message : "Analysis failed");
  }
};
