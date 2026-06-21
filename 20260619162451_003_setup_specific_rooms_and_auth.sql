-- Clear existing data
DELETE FROM photos;
DELETE FROM payments;
DELETE FROM tenants;
DELETE FROM bookings;
DELETE FROM beds;
DELETE FROM rooms;

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "reviews_public_insert" ON reviews FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "reviews_public_select" ON reviews FOR SELECT TO anon, authenticated USING (true);

-- Add default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash) VALUES ('admin', 'admin123');

-- Insert the specific rooms
INSERT INTO rooms (room_number, room_name, sharing_type, price_per_bed, amenities, floor) VALUES
('A', 'A4', 4, 6000, ARRAY['WiFi', 'Security', 'Mess'], 1),
('B', 'B6', 6, 5500, ARRAY['WiFi', 'Security', 'Mess'], 1),
('C', 'C6', 6, 5500, ARRAY['WiFi', 'Security', 'Mess'], 2),
('E', 'E2', 2, 6000, ARRAY['WiFi', 'Security', 'Mess'], 2);

-- Create beds for each room
INSERT INTO beds (room_id, bed_number, status)
SELECT id, 'B' || generate_series(1, sharing_type), 'vacant'
FROM rooms;