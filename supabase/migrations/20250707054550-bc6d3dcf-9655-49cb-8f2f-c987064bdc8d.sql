-- Create enum for booking status
CREATE TYPE public.booking_status AS ENUM ('pending', 'approved', 'rejected', 'completed');

-- Create enum for payment methods
CREATE TYPE public.payment_method AS ENUM ('bank_transfer', 'usdt', 'btc', 'eth');

-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
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
  amount DECIMAL(10,2) NOT NULL,
  payment_method payment_method NOT NULL,
  payment_details JSONB,
  status booking_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);


CREATE TABLE public.celebrities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text not null,
  category text,
  rate_per_hour numeric(10, 2),
  availability boolean default true,
  rating numeric(2, 1) check (rating >= 0 and rating <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = user_uuid AND role = 'admin'
  )
$$;

-- Create policies for bookings
CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings" 
ON public.bookings 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all bookings" 
ON public.bookings 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on user signup
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
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();