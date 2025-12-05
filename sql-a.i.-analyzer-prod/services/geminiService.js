
import { GoogleGenAI } from "@google/genai";
import { mockDb } from '../data/mockDb.js';

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

const cleanJson = (text) => {
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

const getEnvApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY;
    }
  } catch (e) {}
  return undefined;
};

// --- Client Side Implementation (Serverless) ---
const analyzeSqlClient = async (query, apiKey) => {
    const ai = new GoogleGenAI({ apiKey });
    const dbContext = JSON.stringify(mockDb);
    
    const prompt = `
      Database Context: ${dbContext}
      User SQL Query: ${query}
    `;
  
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
    });
  
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const cleanedText = cleanJson(text);
    return JSON.parse(cleanedText);
};

// --- Backend Implementation (FastAPI) ---
const analyzeSqlBackend = async (query, apiKey) => {
    try {
        const response = await fetch('http://localhost:8000/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query,
                apiKey,
                dbContext: mockDb
            })
        });

        if (!response.ok) {
            let errorDetail = 'Backend error';
            try {
                const err = await response.json();
                errorDetail = err.detail || errorDetail;
            } catch (e) {
                // Ignore json parse error
            }
            throw new Error(`Server Error: ${response.status} - ${errorDetail}`);
        }

        return await response.json();
    } catch (e) {
        console.error(e);
        throw new Error(`FastAPI Connection Failed: ${e.message || 'Unknown error'}. Ensure main.py is running on port 8000.`);
    }
};

export const analyzeSql = async (query, apiKey, useBackend = false) => {
  const envKey = getEnvApiKey();
  const key = apiKey || envKey;
  
  if (!key) {
    throw new Error("Gemini API Key is required.");
  }

  try {
    const parsed = useBackend 
        ? await analyzeSqlBackend(query, key)
        : await analyzeSqlClient(query, key);

    // Normalize Data
    return {
        tables: Array.isArray(parsed.tables) ? parsed.tables : [],
        relationships: Array.isArray(parsed.relationships) ? parsed.relationships : [],
        functions: Array.isArray(parsed.functions) ? parsed.functions : [],
        complexityScore: typeof parsed.complexityScore === 'number' ? parsed.complexityScore : 0,
        summary: parsed.summary || "No summary provided.",
        executionPlan: Array.isArray(parsed.executionPlan) ? parsed.executionPlan : [],
        visualFlow: parsed.visualFlow || { nodes: [], edges: [] },
        queryType: parsed.queryType,
        involvedTables: parsed.involvedTables || []
    };

  } catch (error) {
    console.error("Analysis Failed", error);
    throw new Error(error.message || "Analysis failed");
  }
};
