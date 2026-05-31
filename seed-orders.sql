-- Insert demo orders into Supabase
-- Run this in Supabase Dashboard → SQL Editor → New Query → Run

INSERT INTO orders (id, customer_name, email, phone, address, city, items, total, status, created_at)
VALUES
('ORD-001', 'Ayesha Khan', 'ayesha@example.com', '0300-1234567', '42 Garden Town', 'Lahore', '[{"name":"Ivory Linen Kurta","quantity":1,"price":4500,"size":"M","color":"Ivory"},{"name":"Handwoven Pashmina Shawl","quantity":1,"price":8900,"size":"One Size","color":"Maroon"}]', 13400, 'delivered', '2024-05-20T10:30:00Z'),
('ORD-002', 'Bilal Ahmad', 'bilal@example.com', '0301-9876543', '15 DHA Phase 5', 'Lahore', '[{"name":"Midnight Silk Shalwar","quantity":2,"price":3200,"size":"L","color":"Midnight"}]', 6400, 'shipped', '2024-05-22T14:15:00Z'),
('ORD-003', 'Fatima Zahra', 'fatima@example.com', '0302-4567890', '78 Gulberg III', 'Lahore', '[{"name":"Rose Gold Embroidered Gharara","quantity":1,"price":12500,"size":"M","color":"Rose Gold"}]', 12500, 'processing', '2024-05-25T09:00:00Z'),
('ORD-004', 'Hassan Ali', 'hassan@example.com', '0303-1122334', '21 Model Town', 'Lahore', '[{"name":"Classic Waistcoat — Taupe","quantity":1,"price":5200,"size":"XL","color":"Taupe"},{"name":"Leather Crossbody Bag","quantity":1,"price":6800,"size":"One Size","color":"Tan"}]', 12000, 'pending', '2024-05-28T16:45:00Z'),
('ORD-005', 'Sana Malik', 'sana@example.com', '0304-5566778', '9 Johar Town', 'Lahore', '[{"name":"Bridal Lehenga — Crimson Dream","quantity":1,"price":45000,"size":"S","color":"Crimson"}]', 45000, 'pending', '2024-05-29T11:20:00Z')
ON CONFLICT (id) DO NOTHING;
