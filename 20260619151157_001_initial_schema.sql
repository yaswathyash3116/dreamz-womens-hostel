-- Create rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number VARCHAR(20) NOT NULL UNIQUE,
  room_name VARCHAR(100),
  sharing_type INTEGER NOT NULL CHECK (sharing_type IN (2, 4, 6)),
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('boys', 'girls', 'unisex')),
  price_per_bed DECIMAL(10,2) NOT NULL,
  amenities TEXT[],
  floor INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create beds table for bed-level tracking
CREATE TABLE beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  bed_number VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'vacant' CHECK (status IN ('vacant', 'occupied', 'maintenance')),
  current_tenant_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, bed_number)
);

-- Create tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  bed_id UUID REFERENCES beds(id),
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  checkout_date DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'checked_out')),
  monthly_rent DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  preferred_sharing INTEGER CHECK (preferred_sharing IN (2, 4, 6)),
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  assigned_bed_id UUID REFERENCES beds(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create photos table for room/hostel images
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption VARCHAR(200),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table for revenue tracking
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_type VARCHAR(50) DEFAULT 'rent',
  status VARCHAR(20) DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'overdue')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read (rooms, beds, photos)
CREATE POLICY "rooms_public_select" ON rooms FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "beds_public_select" ON beds FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "photos_public_select" ON photos FOR SELECT TO anon, authenticated USING (true);

-- Admin policies (using authenticated role for simplicity)
CREATE POLICY "rooms_admin_insert" ON rooms FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "rooms_admin_update" ON rooms FOR UPDATE TO authenticated USING (true);
CREATE POLICY "rooms_admin_delete" ON rooms FOR DELETE TO authenticated USING (true);

CREATE POLICY "beds_admin_insert" ON beds FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "beds_admin_update" ON beds FOR UPDATE TO authenticated USING (true);
CREATE POLICY "beds_admin_delete" ON beds FOR DELETE TO authenticated USING (true);

CREATE POLICY "tenants_admin_all" ON tenants FOR ALL TO authenticated USING (true);
CREATE POLICY "bookings_admin_all" ON bookings FOR ALL TO authenticated USING (true);
CREATE POLICY "photos_admin_all" ON photos FOR ALL TO authenticated USING (true);
CREATE POLICY "payments_admin_all" ON payments FOR ALL TO authenticated USING (true);

-- Bookings can be inserted publicly
CREATE POLICY "bookings_public_insert" ON bookings FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Insert sample rooms
INSERT INTO rooms (room_number, room_name, sharing_type, gender, price_per_bed, amenities, floor) VALUES
('101', 'Sunrise Room', 4, 'boys', 4500, ARRAY['AC', 'WiFi', 'Attached Bathroom', 'Wardrobe'], 1),
('102', 'Moonlight Room', 2, 'boys', 6500, ARRAY['AC', 'WiFi', 'Attached Bathroom', 'Study Table', 'Balcony'], 1),
('103', 'Starlight Room', 6, 'boys', 3500, ARRAY['Fan', 'WiFi', 'Common Bathroom'], 1),
('201', 'Rose Room', 4, 'girls', 4500, ARRAY['AC', 'WiFi', 'Attached Bathroom', 'Wardrobe'], 2),
('202', 'Lily Room', 2, 'girls', 6500, ARRAY['AC', 'WiFi', 'Attached Bathroom', 'Study Table', 'Balcony'], 2),
('203', 'Jasmine Room', 4, 'girls', 4000, ARRAY['Fan', 'WiFi', 'Attached Bathroom'], 2);

-- Insert beds for each room (bed-level tracking)
INSERT INTO beds (room_id, bed_number, status)
SELECT id, 'B' || generate_series(1, sharing_type), 'vacant'
FROM rooms;

-- Mark some beds as occupied for demo
UPDATE beds SET status = 'occupied', current_tenant_id = gen_random_uuid() 
WHERE bed_number = 'B1' AND room_id = (SELECT id FROM rooms WHERE room_number = '101');
UPDATE beds SET status = 'occupied', current_tenant_id = gen_random_uuid() 
WHERE bed_number = 'B2' AND room_id = (SELECT id FROM rooms WHERE room_number = '101');
UPDATE beds SET status = 'occupied', current_tenant_id = gen_random_uuid() 
WHERE bed_number = 'B4' AND room_id = (SELECT id FROM rooms WHERE room_number = '101');

UPDATE beds SET status = 'occupied', current_tenant_id = gen_random_uuid() 
WHERE bed_number = 'B1' AND room_id = (SELECT id FROM rooms WHERE room_number = '102');

UPDATE beds SET status = 'occupied', current_tenant_id = gen_random_uuid() 
WHERE bed_number = 'B1' AND room_id = (SELECT id FROM rooms WHERE room_number = '201');
UPDATE beds SET status = 'occupied', current_tenant_id = gen_random_uuid() 
WHERE bed_number = 'B3' AND room_id = (SELECT id FROM rooms WHERE room_number = '201');

UPDATE beds SET status = 'occupied', current_tenant_id = gen_random_uuid() 
WHERE bed_number = 'B1' AND room_id = (SELECT id FROM rooms WHERE room_number = '202');
UPDATE beds SET status = 'occupied', current_tenant_id = gen_random_uuid() 
WHERE bed_number = 'B2' AND room_id = (SELECT id FROM rooms WHERE room_number = '202');

-- Insert sample tenants
INSERT INTO tenants (name, email, phone, gender, bed_id, checkin_date, status, monthly_rent)
SELECT 'Rahul Sharma', 'rahul@email.com', '9876543210', 'boys', 
  (SELECT id FROM beds WHERE bed_number = 'B1' AND room_id = (SELECT id FROM rooms WHERE room_number = '101')),
  '2024-01-15', 'active', 4500;

INSERT INTO tenants (name, email, phone, gender, bed_id, checkin_date, status, monthly_rent)
SELECT 'Amit Kumar', 'amit@email.com', '9876543211', 'boys',
  (SELECT id FROM beds WHERE bed_number = 'B2' AND room_id = (SELECT id FROM rooms WHERE room_number = '101')),
  '2024-02-01', 'active', 4500;

INSERT INTO tenants (name, email, phone, gender, bed_id, checkin_date, status, monthly_rent)
SELECT 'Priya Singh', 'priya@email.com', '9876543212', 'girls',
  (SELECT id FROM beds WHERE bed_number = 'B1' AND room_id = (SELECT id FROM rooms WHERE room_number = '201')),
  '2024-01-20', 'active', 4500;

-- Insert sample monthly payments for revenue tracking
INSERT INTO payments (tenant_id, amount, payment_date, payment_type, status)
SELECT id, 4500, '2024-06-01', 'rent', 'paid' FROM tenants WHERE name = 'Rahul Sharma';
INSERT INTO payments (tenant_id, amount, payment_date, payment_type, status)
SELECT id, 4500, '2024-05-01', 'rent', 'paid' FROM tenants WHERE name = 'Rahul Sharma';
INSERT INTO payments (tenant_id, amount, payment_date, payment_type, status)
SELECT id, 4500, '2024-06-01', 'rent', 'paid' FROM tenants WHERE name = 'Amit Kumar';
INSERT INTO payments (tenant_id, amount, payment_date, payment_type, status)
SELECT id, 4500, '2024-06-01', 'rent', 'paid' FROM tenants WHERE name = 'Priya Singh';
INSERT INTO payments (tenant_id, amount, payment_date, payment_type, status)
SELECT id, 6500, '2024-06-01', 'rent', 'paid' FROM tenants LIMIT 1;

-- Insert sample room photos using Pexels
INSERT INTO photos (room_id, url, caption, is_primary) VALUES
((SELECT id FROM rooms WHERE room_number = '101'), 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800', 'Modern 4-sharing room', true),
((SELECT id FROM rooms WHERE room_number = '102'), 'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=800', 'Premium 2-sharing room', true),
((SELECT id FROM rooms WHERE room_number = '201'), 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800', 'Girls 4-sharing room', true),
((SELECT id FROM rooms WHERE room_number = '202'), 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800', 'Premium girls room', true);