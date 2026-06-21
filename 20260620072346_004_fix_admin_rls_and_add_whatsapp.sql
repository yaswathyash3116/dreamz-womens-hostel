-- Fix admin_users RLS - allow anonymous select for login verification
CREATE POLICY "admin_users_select" ON admin_users FOR SELECT TO anon, authenticated USING (true);

-- Add WhatsApp notification function - stores booking data 
-- When a booking is created, we'll send WhatsApp message via the app