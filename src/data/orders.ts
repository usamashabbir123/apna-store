import { Order } from '@/lib/admin-types';

export const initialOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Ayesha Khan',
    email: 'ayesha@example.com',
    phone: '0300-1234567',
    address: '42 Garden Town',
    city: 'Lahore',
    items: [
      { name: 'Ivory Linen Kurta', quantity: 1, price: 4500, size: 'M', color: 'Ivory' },
      { name: 'Handwoven Pashmina Shawl', quantity: 1, price: 8900, size: 'One Size', color: 'Maroon' },
    ],
    total: 13400,
    status: 'delivered',
    createdAt: '2024-05-20T10:30:00Z',
  },
  {
    id: 'ORD-002',
    customerName: 'Bilal Ahmad',
    email: 'bilal@example.com',
    phone: '0301-9876543',
    address: '15 DHA Phase 5',
    city: 'Lahore',
    items: [
      { name: 'Midnight Silk Shalwar', quantity: 2, price: 3200, size: 'L', color: 'Midnight' },
    ],
    total: 6400,
    status: 'shipped',
    createdAt: '2024-05-22T14:15:00Z',
  },
  {
    id: 'ORD-003',
    customerName: 'Fatima Zahra',
    email: 'fatima@example.com',
    phone: '0302-4567890',
    address: '78 Gulberg III',
    city: 'Lahore',
    items: [
      { name: 'Rose Gold Embroidered Gharara', quantity: 1, price: 12500, size: 'M', color: 'Rose Gold' },
    ],
    total: 12500,
    status: 'processing',
    createdAt: '2024-05-25T09:00:00Z',
  },
  {
    id: 'ORD-004',
    customerName: 'Hassan Ali',
    email: 'hassan@example.com',
    phone: '0303-1122334',
    address: '21 Model Town',
    city: 'Lahore',
    items: [
      { name: 'Classic Waistcoat — Taupe', quantity: 1, price: 5200, size: 'XL', color: 'Taupe' },
      { name: 'Leather Crossbody Bag', quantity: 1, price: 6800, size: 'One Size', color: 'Tan' },
    ],
    total: 12000,
    status: 'pending',
    createdAt: '2024-05-28T16:45:00Z',
  },
  {
    id: 'ORD-005',
    customerName: 'Sana Malik',
    email: 'sana@example.com',
    phone: '0304-5566778',
    address: '9 Johar Town',
    city: 'Lahore',
    items: [
      { name: 'Bridal Lehenga — Crimson Dream', quantity: 1, price: 45000, size: 'S', color: 'Crimson' },
    ],
    total: 45000,
    status: 'pending',
    createdAt: '2024-05-29T11:20:00Z',
  },
];

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return initialOrders;
  const stored = localStorage.getItem('apna_orders');
  return stored ? JSON.parse(stored) : initialOrders;
}

export function saveOrders(orders: Order[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('apna_orders', JSON.stringify(orders));
  }
}

export function updateOrderStatus(orderId: string, status: Order['status']) {
  const orders = getOrders();
  const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
  saveOrders(updated);
  return updated;
}
