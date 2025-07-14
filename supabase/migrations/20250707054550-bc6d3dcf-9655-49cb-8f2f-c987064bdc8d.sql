-- Booking Status Enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'approved', 'rejected', 'completed');

-- Payment Method Enum
CREATE TYPE public.payment_method AS ENUM ('bank_transfer', 'usdt', 'btc', 'eth');

-- User Role Enum
CREATE TYPE public.user_role AS ENUM ('admin', 'user');


CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role public.user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  celebrity_id TEXT NOT NULL,
  celebrity_name TEXT NOT NULL,
  package_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  event_location TEXT NOT NULL,
  event_type TEXT NOT NULL,
  guest_count INTEGER NOT NULL,
  special_requests TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  payment_method public.payment_method NOT NULL,
  payment_details JSONB,
  status public.booking_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE public.celebrities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  rate_per_hour NUMERIC(10, 2) NOT NULL,
  availability BOOLEAN DEFAULT TRUE,
  rating NUMERIC(2, 1) CHECK (rating >= 0 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);


DELETE FROM public.bookings;


CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_celebrities_updated_at
BEFORE UPDATE ON public.celebrities
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.celebrities ENABLE ROW LEVEL SECURITY;


CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = user_uuid AND role = 'admin'
  );
$$;


-- Users can manage their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_admin(auth.uid()));


-- Users
CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
ON public.bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
ON public.bookings FOR UPDATE
USING (auth.uid() = user_id);

-- Admins
CREATE POLICY "Admins can view all bookings"
ON public.bookings FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all bookings"
ON public.bookings FOR UPDATE
USING (public.is_admin(auth.uid()));


-- Admins manage celebrities
CREATE POLICY "Admins can view celebrities"
ON public.celebrities FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert celebrities"
ON public.celebrities FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update celebrities"
ON public.celebrities FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete celebrities"
ON public.celebrities FOR DELETE
USING (public.is_admin(auth.uid()));


CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
