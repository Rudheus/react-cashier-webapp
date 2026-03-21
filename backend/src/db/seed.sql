-- Password untuk semua akun: "password123"
INSERT INTO users (name, email, password, role) VALUES
('Admin Owner', 'owner@cafe.com', 'password', 'owner'),
('Manager', 'manager@cafe.com', 'password', 'manager'),
('Cashier', 'cashier@cafe.com', 'password', 'cashier')
ON CONFLICT (email) DO NOTHING;

-- Produk contoh
INSERT INTO products (name, price, category, stock) VALUES
('Americano', 18000, 'coffee', 50),
('Latte', 22000, 'coffee', 50),
('Cappuccino', 22000, 'coffee', 50),
('Croissant', 15000, 'food', 30),
('Green Tea', 18000, 'drinks', 40)
ON CONFLICT DO NOTHING;