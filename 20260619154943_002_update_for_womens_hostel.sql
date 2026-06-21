-- Update rooms table to remove gender constraint
ALTER TABLE rooms DROP CONSTRAINT IF EXISTS rooms_gender_check;
ALTER TABLE rooms DROP COLUMN IF EXISTS gender;

-- Update sharing_type constraint to include 3
ALTER TABLE rooms DROP CONSTRAINT IF EXISTS rooms_sharing_type_check;
ALTER TABLE rooms ADD CONSTRAINT rooms_sharing_type_check CHECK (sharing_type IN (2, 3, 4, 6));

-- Update bookings to remove gender
ALTER TABLE bookings DROP COLUMN IF EXISTS gender;

-- Update tenants to remove gender  
ALTER TABLE tenants DROP COLUMN IF EXISTS gender;

-- Update beds constraint
ALTER TABLE beds DROP CONSTRAINT IF EXISTS beds_status_check;
ALTER TABLE beds ADD CONSTRAINT beds_status_check CHECK (status IN ('vacant', 'occupied', 'maintenance'));

-- Delete sample photos
DELETE FROM photos;

-- Update sample rooms (make them all 3 sharing for demo)
UPDATE rooms SET sharing_type = 3 WHERE sharing_type = 6;