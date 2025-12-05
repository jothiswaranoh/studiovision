
import { VisualFlow } from '../types';

// Basic topological sort implementation for SQL generation
export const generateSqlFromFlow = (flow: VisualFlow): string => {
  if (!flow || !flow.nodes.length) return '';

  const { nodes, edges } = flow;

  // Helper to find connected nodes
  const getSources = (targetId: string) => edges.filter(e => e.target === targetId).map(e => nodes.find(n => n.id === e.source)).filter(Boolean);

  // 1. Identify Core Components
  const tableNodes = nodes.filter(n => n.type === 'TABLE' || n.type === 'CTE' || n.type === 'SUBQUERY');
  const selectNode = nodes.find(n => n.type === 'SELECT');
  // If multiple selects exist (subqueries), this simple generator targets the "main" one (usually the one without outgoing edges or last created)
  // For now, let's try to find a root-like SELECT (no target edges leading to other operations, or just the first one)

  // 2. Build FROM/JOIN Clause
  // This is the most complex part. We need to find the "primary" table and then chain joins.
  // Heuristic: The table that flows into the SELECT (eventually) without passing through another FROM/JOIN?
  // Simpler Heuristic: All tables are part of FROM.

  // Let's iterate through nodes to find specific clauses
  let selectClause = 'SELECT *';
  let fromClause = '';
  let whereClauses: string[] = [];
  let groupClauses: string[] = [];
  let havingClauses: string[] = [];
  let orderClauses: string[] = [];
  const ctes: string[] = [];

  // Handle CTE nodes first
  nodes.filter(n => n.type === 'CTE').forEach(cte => {
    ctes.push(cte.label); // Assuming label contains definition like "cte_name AS (...)"
  });

  // Handle SELECT Node
  if (selectNode) {
    if (selectNode.data?.columns?.length) {
      selectClause = `SELECT ${selectNode.data.columns.map((c: any) => `${c.table}.${c.column}`).join(', ')}`;
    } else {
      // Fallback to label if manually edited or no dropped columns
      selectClause = selectNode.label.startsWith('SELECT') ? selectNode.label : `SELECT ${selectNode.label}`;
    }
  }

  // Handle TABLES & JOINS
  // We need to order them. Find the initial table (source of a chain).
  // Graph traversal: Find table nodes.
  if (tableNodes.length > 0) {
    const primaryTable = tableNodes[0]; // Naive: first table is primary
    fromClause = `FROM ${primaryTable.label}`;

    // Find Joins connected to tables
    // Real-world: Tables connect to Joins. Table A -> Join -> Table B? No, usually Table A & Table B -> Join Node.
    // Or Table A -> Join Node. Join Node -> ...

    const joinNodes = nodes.filter(n => n.type.includes('JOIN'));
    joinNodes.forEach(joinNode => {
      // Identify the tables connected to this join
      // Just append the join label for now, assuming user configured it right
      // Enhanced: if we have dropped columns on JOIN node, we can construct the ON clause
      let joinStr = joinNode.type; // "INNER JOIN"

      // Try to find the target table for this join (the one being joined)
      // This is tricky visually. Usually visualizer connects Table -> Join. 
      // Let's assume the label contains the table name or user has written it.
      // Or we use dropped columns to build: "INNER JOIN table_name ON t1.c1 = t2.c2"

      let condition = "";
      if (joinNode.data?.columns?.length >= 2) {
        const [c1, c2] = joinNode.data.columns;
        condition = `ON ${c1.table}.${c1.column} = ${c2.table}.${c2.column}`;
      }

      // If label already has text, use it, else try to construct
      if (joinNode.label && joinNode.label !== joinNode.type) {
        joinStr += ` ${joinNode.label}`; // "INNER JOIN users u"
      }

      if (condition) {
        joinStr += ` ${condition}`;
      }

      fromClause += `\n${joinStr}`;
    });
  }

  // WHERE
  nodes.filter(n => n.type === 'WHERE').forEach(node => {
    if (node.data?.columns?.length) {
      // Construct condition from dropped columns? 
      // Difficult to guess operator. Default to IS NOT NULL or just list them?
      // Let's just append the label for now, and maybe the column names.
      // Better: If label is empty/default, use columns.
      let cond = node.label !== 'WHERE' ? node.label : '';
      if (node.data.columns.length > 0) {
        const colConds = node.data.columns.map((c: any) => `${c.table}.${c.column} = ?`);
        cond = cond ? `${cond} AND ${colConds.join(' AND ')}` : colConds.join(' AND ');
      }
      if (cond) whereClauses.push(cond);
    } else if (node.label && node.label !== 'WHERE') {
      whereClauses.push(node.label);
    }
  });

  // GROUP BY
  nodes.filter(n => n.type === 'GROUP BY').forEach(node => {
    if (node.data?.columns?.length) {
      groupClauses.push(node.data.columns.map((c: any) => `${c.table}.${c.column}`).join(', '));
    } else if (node.label && node.label !== 'GROUP BY') {
      groupClauses.push(node.label);
    }
  });

  // ORDER BY
  nodes.filter(n => n.type === 'ORDER BY').forEach(node => {
    if (node.data?.columns?.length) {
      orderClauses.push(node.data.columns.map((c: any) => `${c.table}.${c.column}`).join(', '));
    } else if (node.label && node.label !== 'ORDER BY') {
      orderClauses.push(node.label);
    }
  });


  // Assembly
  let sql = '';
  if (ctes.length) sql += `WITH ${ctes.join(', ')}\n`;

  sql += `${selectClause}\n`;
  if (fromClause) sql += `${fromClause}\n`;
  if (whereClauses.length) sql += `WHERE ${whereClauses.join(' AND ')}\n`;
  if (groupClauses.length) sql += `GROUP BY ${groupClauses.join(', ')}\n`;
  if (havingClauses.length) sql += `HAVING ${havingClauses.join(' AND ')}\n`;
  if (orderClauses.length) sql += `ORDER BY ${orderClauses.join(', ')}\n`;

  return sql;
};
