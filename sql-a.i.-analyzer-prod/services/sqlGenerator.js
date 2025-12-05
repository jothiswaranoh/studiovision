
export const generateSqlFromFlow = (flow) => {
  if (!flow || !flow.nodes.length) return '';

  // Extract nodes by type
  const selects = flow.nodes.filter(n => n.type === 'SELECT');
  const tables = flow.nodes.filter(n => n.type === 'TABLE');
  const joins = flow.nodes.filter(n => n.type.includes('JOIN'));
  const wheres = flow.nodes.filter(n => n.type === 'WHERE');
  const groups = flow.nodes.filter(n => n.type === 'GROUP BY');
  const orders = flow.nodes.filter(n => n.type === 'ORDER BY');
  const ctes = flow.nodes.filter(n => n.type === 'CTE');
  const dml = flow.nodes.filter(n => ['INSERT', 'UPDATE', 'DELETE'].includes(n.type));

  // Helper to get text content from label
  const getText = (nodes, prefix = '') => {
    if (nodes.length === 0) return '';
    const content = nodes.map(n => n.label.replace(new RegExp(`^${prefix}\\s*`, 'i'), '')).join(', ');
    return content;
  };

  // Construct parts
  let sql = '';

  // CTEs
  if (ctes.length > 0) {
      sql += `WITH ${ctes.map(c => c.label).join(',\n')}\n`;
  }

  // DML
  if (dml.length > 0) {
      sql += `${dml[0].label}\n`;
      return sql; // Usually DML wraps everything differently, simplistic approach
  }

  // SELECT
  if (selects.length > 0) {
    sql += `SELECT ${getText(selects, 'SELECT')}\n`;
  } else {
    sql += `SELECT *\n`; // Default
  }

  // FROM
  if (tables.length > 0) {
    const mainTable = tables[0];
    sql += `FROM ${mainTable.label}\n`;
  }

  // JOIN
  if (joins.length > 0) {
    joins.forEach(j => {
      // Clean up label if it contains "JOIN" prefix redundant in visual
      let joinStr = j.label;
      if (!joinStr.toUpperCase().includes('JOIN')) {
         joinStr = `${j.type} ${joinStr}`;
      }
      sql += `${joinStr}\n`;
    });
  }

  // WHERE
  if (wheres.length > 0) {
    sql += `WHERE ${getText(wheres, 'WHERE')}\n`;
  }

  // GROUP BY
  if (groups.length > 0) {
    sql += `GROUP BY ${getText(groups, 'GROUP BY')}\n`;
  }

  // ORDER BY
  if (orders.length > 0) {
    sql += `ORDER BY ${getText(orders, 'ORDER BY')}\n`;
  }

  // Add signature
  sql += `\n-- Auto-generated from Visual Flow`;

  return sql;
};
