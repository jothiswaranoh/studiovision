
export const DEFAULT_QUERY = `SELECT 
  u.name as user_name, 
  o.id as order_id, 
  o.total_amount,
  p.name as product_name
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN products p ON o.product_id = p.id
WHERE o.total_amount > 100
ORDER BY o.total_amount DESC;`;
