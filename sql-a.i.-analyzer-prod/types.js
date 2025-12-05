
// Types are not enforced in JavaScript. 
// This file is kept as a reference for the data structures used in the app.

/*
  Data Structures Reference:
  
  TableNode: { id, name, alias, columns: [], position: {x, y}, type }
  Relationship: { id, sourceTable, targetTable, sourceColumn, targetColumn, type, condition }
  ExecutionStep: { stepId, operation, description, explanation, resultData: [] }
  FlowchartNode: { id, type, label, stepId, columns: [], x, y, data }
  FlowchartEdge: { id, source, target, label, selected }
  VisualFlow: { nodes: [], edges: [] }
  AnalysisResult: { tables, relationships, functions, complexityScore, summary, executionPlan, visualFlow, queryType, involvedTables }
*/
