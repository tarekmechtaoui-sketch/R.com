-- =============================================
-- R.com - Seed Data
-- =============================================
-- Run AFTER schema.sql
-- This inserts sample categories and products

-- ── Categories ──
INSERT INTO categories (name, slug, description, image) VALUES
  ('Cases & Covers', 'cases', 'Protect your device in style with our premium phone cases.', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80'),
  ('Chargers & Cables', 'chargers', 'Fast charging solutions and durable cables for all devices.', 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400&q=80'),
  ('Audio & Headphones', 'audio', 'Immersive sound experience with our premium audio accessories.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'),
  ('Screen Protection', 'protection', 'Crystal clear screen protectors for maximum display safety.', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80'),
  ('Smart Accessories', 'smart', 'Smart gadgets and tech accessories for modern living.', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'),
  ('Power Banks', 'power', 'Never run out of battery with our high-capacity power banks.', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80'),
  ('Mounts & Stands', 'mounts', 'Convenient mounts and stands for home, office, and car.', 'https://images.unsplash.com/photo-1603539947678-cd3954ed515d?w=400&q=80'),
  ('Bluetooth Speakers', 'speakers', 'Portable and powerful Bluetooth speakers for any occasion.', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80')
ON CONFLICT (slug) DO NOTHING;

-- ── Products (sample) ──
-- NOTE: Replace category_id values with actual UUIDs after inserting categories
-- These are example products; images use Unsplash URLs as placeholders

WITH cat AS (SELECT id, slug FROM categories)
INSERT INTO products (name, description, price, category_id, stock, images, status, featured)
SELECT
  'Wireless Earbuds Pro',
  'Premium true wireless earbuds with active noise cancellation, 30-hour battery life, and IPX5 water resistance.',
  4500,
  (SELECT id FROM cat WHERE slug = 'audio'),
  50,
  ARRAY['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80'],
  'active',
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Wireless Earbuds Pro');

WITH cat AS (SELECT id, slug FROM categories)
INSERT INTO products (name, description, price, category_id, stock, images, status, featured)
SELECT
  'Smart Watch Series X',
  'Advanced fitness tracking smartwatch with heart rate monitor, GPS, and 7-day battery life.',
  12000,
  (SELECT id FROM cat WHERE slug = 'smart'),
  30,
  ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'],
  'active',
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smart Watch Series X');

WITH cat AS (SELECT id, slug FROM categories)
INSERT INTO products (name, description, price, category_id, stock, images, status, featured)
SELECT
  'Premium Phone Case',
  'Military-grade drop protection with a slim profile. Compatible with all major smartphone models.',
  850,
  (SELECT id FROM cat WHERE slug = 'cases'),
  100,
  ARRAY['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80'],
  'active',
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Premium Phone Case');

WITH cat AS (SELECT id, slug FROM categories)
INSERT INTO products (name, description, price, category_id, stock, images, status, featured)
SELECT
  'Fast Charger 65W',
  'Ultra-fast 65W GaN charger with USB-C and USB-A ports. Charges your phone to 50% in just 20 minutes.',
  2200,
  (SELECT id FROM cat WHERE slug = 'chargers'),
  75,
  ARRAY['https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&q=80'],
  'active',
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fast Charger 65W');

WITH cat AS (SELECT id, slug FROM categories)
INSERT INTO products (name, description, price, category_id, stock, images, status, featured)
SELECT
  'Power Bank 20000mAh',
  'High-capacity power bank with 20000mAh, dual USB output, and LED indicator. Charge up to 5 devices.',
  3500,
  (SELECT id FROM cat WHERE slug = 'power'),
  60,
  ARRAY['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80'],
  'active',
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Power Bank 20000mAh');

WITH cat AS (SELECT id, slug FROM categories)
INSERT INTO products (name, description, price, category_id, stock, images, status, featured)
SELECT
  'Tempered Glass Screen Protector',
  '9H hardness tempered glass with 99.9% clarity. Anti-fingerprint coating for a clean screen.',
  350,
  (SELECT id FROM cat WHERE slug = 'protection'),
  200,
  ARRAY['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80'],
  'active',
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Tempered Glass Screen Protector');

WITH cat AS (SELECT id, slug FROM categories)
INSERT INTO products (name, description, price, category_id, stock, images, status, featured)
SELECT
  'Bluetooth Speaker Mini',
  'Compact waterproof Bluetooth speaker with 360° sound and 12-hour battery. Perfect for outdoor adventures.',
  5500,
  (SELECT id FROM cat WHERE slug = 'speakers'),
  40,
  ARRAY['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80'],
  'active',
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bluetooth Speaker Mini');

WITH cat AS (SELECT id, slug FROM categories)
INSERT INTO products (name, description, price, category_id, stock, images, status, featured)
SELECT
  'Car Phone Mount',
  'Universal magnetic car phone mount with 360° rotation and strong adhesive. Fits all dashboard types.',
  750,
  (SELECT id FROM cat WHERE slug = 'mounts'),
  90,
  ARRAY['https://images.unsplash.com/photo-1603539947678-cd3954ed515d?w=600&q=80'],
  'active',
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Car Phone Mount');

-- =============================================
-- HOW TO CREATE THE FIRST SUPER ADMIN
-- =============================================
-- 1. Go to Supabase Dashboard > Authentication > Users > Add User
-- 2. Create a user with email and password
-- 3. Then run this SQL (replace with the actual user ID from step 2):
--
-- UPDATE profiles
-- SET role = 'super_admin'
-- WHERE email = 'your-admin@email.com';
--
-- Or insert directly if trigger did not fire:
-- INSERT INTO profiles (id, email, role)
-- VALUES ('user-uuid-here', 'your-admin@email.com', 'super_admin');
