import { MockDatabase } from '../types';

export const mockDb: MockDatabase = {
  users: {
    name: 'users',
    schema: [
      { name: 'id', type: 'INT', isPrimaryKey: true },
      { name: 'name', type: 'VARCHAR' },
      { name: 'email', type: 'VARCHAR' },
      { name: 'role', type: 'VARCHAR' },
    ],
    data: [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'customer' },
      { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'customer' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'admin' },
      { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'customer' },
    ]
  },
  products: {
    name: 'products',
    schema: [
      { name: 'id', type: 'INT', isPrimaryKey: true },
      { name: 'name', type: 'VARCHAR' },
      { name: 'category', type: 'VARCHAR' },
      { name: 'price', type: 'DECIMAL' },
    ],
    data: [
      { id: 101, name: 'Laptop Pro', category: 'Electronics', price: 1200 },
      { id: 102, name: 'Wireless Mouse', category: 'Electronics', price: 25 },
      { id: 103, name: 'Coffee Mug', category: 'Home', price: 15 },
      { id: 104, name: 'Gaming Chair', category: 'Furniture', price: 300 },
    ]
  },
  orders: {
    name: 'orders',
    schema: [
      { name: 'id', type: 'INT', isPrimaryKey: true },
      { name: 'user_id', type: 'INT', isForeignKey: true },
      { name: 'product_id', type: 'INT', isForeignKey: true },
      { name: 'total_amount', type: 'DECIMAL' },
      { name: 'status', type: 'VARCHAR' },
    ],
    data: [
      { id: 5001, user_id: 1, product_id: 101, total_amount: 1200, status: 'completed' },
      { id: 5002, user_id: 1, product_id: 102, total_amount: 25, status: 'completed' },
      { id: 5003, user_id: 2, product_id: 103, total_amount: 15, status: 'pending' },
      { id: 5004, user_id: 4, product_id: 104, total_amount: 300, status: 'shipped' },
    ]
  },
  stores: {
    name: 'stores',
    schema: [
      { name: 'id', type: 'INT', isPrimaryKey: true },
      { name: 'location_id', type: 'INT', isForeignKey: true },
      { name: 'store_name', type: 'VARCHAR' },
    ],
    data: [
      { id: 1, location_id: 10, store_name: 'TechHub Downtown' },
      { id: 2, location_id: 11, store_name: 'HomeGoods Uptown' },
    ]
  },
  locations: {
    name: 'locations',
    schema: [
      { name: 'id', type: 'INT', isPrimaryKey: true },
      { name: 'city', type: 'VARCHAR' },
      { name: 'zip', type: 'VARCHAR' },
    ],
    data: [
      { id: 10, city: 'New York', zip: '10001' },
      { id: 11, city: 'San Francisco', zip: '94105' },
    ]
  },
  coupons: {
    name: 'coupons',
    schema: [
      { name: 'code', type: 'VARCHAR', isPrimaryKey: true },
      { name: 'discount_percent', type: 'INT' },
    ],
    data: [
      { code: 'SAVE10', discount_percent: 10 },
      { code: 'WELCOME20', discount_percent: 20 },
    ]
  }
};