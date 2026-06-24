-- GlowCity AI — Initial Schema
-- Run in Supabase SQL Editor or via supabase db push

CREATE EXTENSION IF NOT EXISTS vector;

-- ─── Profiles ───────────────────────────────────────────────────────────────
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'salon_owner', 'admin')),
  full_name TEXT,
  phone TEXT,
  city TEXT,
  area TEXT,
  avatar_url TEXT,
  skin_type TEXT,
  hair_type TEXT,
  concerns TEXT[] DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  loyalty_points INT NOT NULL DEFAULT 0,
  loyalty_tier TEXT NOT NULL DEFAULT 'silver',
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Salons ─────────────────────────────────────────────────────────────────
CREATE TABLE salons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  about TEXT,
  category TEXT[] DEFAULT '{}',
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  address TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  phone TEXT,
  email TEXT,
  price_range_min INT DEFAULT 0,
  price_range_max INT DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  cover_image_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  hours JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_salons_city ON salons(city);
CREATE INDEX idx_salons_status ON salons(status);
CREATE INDEX idx_salons_slug ON salons(slug);

-- ─── Services ───────────────────────────────────────────────────────────────
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL DEFAULT 60,
  price INT NOT NULL,
  original_price INT,
  image_url TEXT,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_services_salon ON services(salon_id);

-- ─── Stylists ───────────────────────────────────────────────────────────────
CREATE TABLE stylists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  experience_years INT DEFAULT 0,
  speciality TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  image_url TEXT,
  languages TEXT[] DEFAULT '{English, Hindi}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_stylists_salon ON stylists(salon_id);

-- ─── Bookings ───────────────────────────────────────────────────────────────
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  stylist_id UUID REFERENCES stylists(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  price INT NOT NULL,
  platform_fee INT DEFAULT 0,
  loyalty_discount INT DEFAULT 0,
  total_amount INT NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  points_earned INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_salon ON bookings(salon_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date, booking_time);

-- Prevent double-booking: one confirmed booking per stylist+date+time
CREATE UNIQUE INDEX idx_bookings_stylist_slot
  ON bookings(stylist_id, booking_date, booking_time)
  WHERE status IN ('pending', 'confirmed') AND stylist_id IS NOT NULL;

-- ─── Reviews ────────────────────────────────────────────────────────────────
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_salon ON reviews(salon_id);

-- ─── Loyalty Transactions ─────────────────────────────────────────────────────
CREATE TABLE loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('earn', 'redeem')),
  points INT NOT NULL,
  description TEXT,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_loyalty_customer ON loyalty_transactions(customer_id);

-- ─── AI Conversations ───────────────────────────────────────────────────────
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_conversations_customer ON ai_conversations(customer_id);

-- ─── Salon Embeddings (pgvector) ────────────────────────────────────────────
CREATE TABLE salon_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL UNIQUE REFERENCES salons(id) ON DELETE CASCADE,
  embedding vector(1536),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_salon_embeddings_vector ON salon_embeddings
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 20);

-- ─── Helper: update salon rating on review ──────────────────────────────────
CREATE OR REPLACE FUNCTION update_salon_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE salons SET
    rating = (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE salon_id = NEW.salon_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE salon_id = NEW.salon_id)
  WHERE id = NEW.salon_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_salon_rating
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_salon_rating();

-- ─── Auto-create profile on signup ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE stylists ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_embeddings ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins read all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Salons (public read approved)
CREATE POLICY "Public read approved salons" ON salons FOR SELECT USING (status = 'approved');
CREATE POLICY "Owners read own salons" ON salons FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Owners manage own salons" ON salons FOR ALL USING (owner_id = auth.uid());
CREATE POLICY "Admins manage all salons" ON salons FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Services
CREATE POLICY "Public read services of approved salons" ON services FOR SELECT USING (
  EXISTS (SELECT 1 FROM salons WHERE salons.id = services.salon_id AND salons.status = 'approved')
);
CREATE POLICY "Owners manage own services" ON services FOR ALL USING (
  EXISTS (SELECT 1 FROM salons WHERE salons.id = services.salon_id AND salons.owner_id = auth.uid())
);

-- Stylists
CREATE POLICY "Public read stylists" ON stylists FOR SELECT USING (
  EXISTS (SELECT 1 FROM salons WHERE salons.id = stylists.salon_id AND salons.status = 'approved')
);
CREATE POLICY "Owners manage stylists" ON stylists FOR ALL USING (
  EXISTS (SELECT 1 FROM salons WHERE salons.id = stylists.salon_id AND salons.owner_id = auth.uid())
);

-- Bookings
CREATE POLICY "Customers read own bookings" ON bookings FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Customers create bookings" ON bookings FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Customers update own bookings" ON bookings FOR UPDATE USING (customer_id = auth.uid());
CREATE POLICY "Salon owners read salon bookings" ON bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM salons WHERE salons.id = bookings.salon_id AND salons.owner_id = auth.uid())
);
CREATE POLICY "Salon owners update salon bookings" ON bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM salons WHERE salons.id = bookings.salon_id AND salons.owner_id = auth.uid())
);

-- Reviews
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Customers create reviews" ON reviews FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Customers update own reviews" ON reviews FOR UPDATE USING (customer_id = auth.uid());

-- Loyalty
CREATE POLICY "Customers read own loyalty" ON loyalty_transactions FOR SELECT USING (customer_id = auth.uid());

-- AI Conversations
CREATE POLICY "Customers manage own conversations" ON ai_conversations FOR ALL USING (customer_id = auth.uid());

-- Embeddings (public read for recommendations)
CREATE POLICY "Public read embeddings" ON salon_embeddings FOR SELECT USING (true);

-- ─── RPC: match salons by embedding ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION match_salons(
  query_embedding vector(1536),
  match_city TEXT DEFAULT NULL,
  match_count INT DEFAULT 6
)
RETURNS TABLE (
  salon_id UUID,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    se.salon_id,
    1 - (se.embedding <=> query_embedding) AS similarity
  FROM salon_embeddings se
  JOIN salons s ON s.id = se.salon_id
  WHERE s.status = 'approved'
    AND (match_city IS NULL OR s.city = match_city)
    AND se.embedding IS NOT NULL
  ORDER BY se.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
