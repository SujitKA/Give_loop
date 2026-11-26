-- ==============================================================================
-- GiveLoop - Database Schema & Row Level Security (RLS) Policies
-- PostgreSQL / Supabase
-- Fully Idempotent (Safe to run multiple times)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. Custom Types & ENUMs
-- ==============================================================================
DO $$ BEGIN
    CREATE TYPE item_category AS ENUM ('Clothes', 'Furniture', 'Textbooks', 'Laptops', 'Other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE item_condition AS ENUM ('Like new', 'Good', 'Fair');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE item_status AS ENUM ('Available', 'Reserved', 'Given');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_status AS ENUM ('Pending', 'Accepted', 'Declined');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. Profiles Table (Linked to Supabase Auth)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT '',
    city TEXT NOT NULL DEFAULT 'Bengaluru',
    avatar_url TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 4. Items Table (Donated listings)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category item_category NOT NULL,
    condition item_condition NOT NULL,
    city TEXT NOT NULL DEFAULT 'Bengaluru',
    images TEXT[] NOT NULL DEFAULT '{}',
    status item_status NOT NULL DEFAULT 'Available',
    is_reported BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT max_images_check CHECK (cardinality(images) <= 4)
);

-- Indexes for performance (search, filters, sort)
CREATE INDEX IF NOT EXISTS idx_items_created_at ON public.items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_items_category ON public.items(category);
CREATE INDEX IF NOT EXISTS idx_items_condition ON public.items(condition);
CREATE INDEX IF NOT EXISTS idx_items_city ON public.items(city);
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_items_donor_id ON public.items(donor_id);
-- Full-text search index for fast keyword matching
CREATE INDEX IF NOT EXISTS idx_items_search ON public.items USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));

-- ==============================================================================
-- 5. Item Requests Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.item_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status request_status NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    -- One request per user per item to prevent spamming
    CONSTRAINT unique_item_requester UNIQUE(item_id, requester_id)
);

CREATE INDEX IF NOT EXISTS idx_requests_item_id ON public.item_requests(item_id);
CREATE INDEX IF NOT EXISTS idx_requests_requester_id ON public.item_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.item_requests(status);

-- ==============================================================================
-- 6. Reports Table (Anti-spam / Inappropriate listing flag)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_item_reporter UNIQUE(item_id, reporter_id)
);

CREATE INDEX IF NOT EXISTS idx_reports_item_id ON public.reports(item_id);

-- ==============================================================================
-- 7. Automated Profile Creation Trigger on Auth Signup
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, city, avatar_url, phone)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'city', 'Bengaluru'),
        COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
        COALESCE(new.raw_user_meta_data->>'phone', '')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_items_updated_at ON public.items;
CREATE TRIGGER set_items_updated_at
    BEFORE UPDATE ON public.items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_requests_updated_at ON public.item_requests;
CREATE TRIGGER set_requests_updated_at
    BEFORE UPDATE ON public.item_requests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to automatically set is_reported = true on items when reported
CREATE OR REPLACE FUNCTION public.handle_item_reported()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.items
    SET is_reported = true
    WHERE id = NEW.item_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_item_reported ON public.reports;
CREATE TRIGGER on_item_reported
    AFTER INSERT ON public.reports
    FOR EACH ROW EXECUTE FUNCTION public.handle_item_reported();

-- ==============================================================================
-- 8. Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- Profiles Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public profiles are readable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are readable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- Items Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view available items" ON public.items;
CREATE POLICY "Anyone can view available items"
    ON public.items FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create items" ON public.items;
CREATE POLICY "Authenticated users can create items"
    ON public.items FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = donor_id);

DROP POLICY IF EXISTS "Donors can update their own items" ON public.items;
CREATE POLICY "Donors can update their own items"
    ON public.items FOR UPDATE
    TO authenticated
    USING (auth.uid() = donor_id)
    WITH CHECK (auth.uid() = donor_id);

DROP POLICY IF EXISTS "Donors can delete their own items" ON public.items;
CREATE POLICY "Donors can delete their own items"
    ON public.items FOR DELETE
    TO authenticated
    USING (auth.uid() = donor_id);

-- ------------------------------------------------------------------------------
-- Item Requests Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Requesters and donors can view requests" ON public.item_requests;
CREATE POLICY "Requesters and donors can view requests"
    ON public.item_requests FOR SELECT
    TO authenticated
    USING (
        auth.uid() = requester_id OR
        auth.uid() IN (SELECT donor_id FROM public.items WHERE public.items.id = item_requests.item_id)
    );

DROP POLICY IF EXISTS "Authenticated users can create requests" ON public.item_requests;
CREATE POLICY "Authenticated users can create requests"
    ON public.item_requests FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = requester_id AND
        auth.uid() NOT IN (SELECT donor_id FROM public.items WHERE public.items.id = item_requests.item_id)
    );

DROP POLICY IF EXISTS "Donors and requesters can update requests" ON public.item_requests;
CREATE POLICY "Donors and requesters can update requests"
    ON public.item_requests FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = requester_id OR
        auth.uid() IN (SELECT donor_id FROM public.items WHERE public.items.id = item_requests.item_id)
    )
    WITH CHECK (
        auth.uid() = requester_id OR
        auth.uid() IN (SELECT donor_id FROM public.items WHERE public.items.id = item_requests.item_id)
    );

-- ------------------------------------------------------------------------------
-- Reports Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can submit reports" ON public.reports;
CREATE POLICY "Authenticated users can submit reports"
    ON public.reports FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = reporter_id AND
        auth.uid() NOT IN (SELECT donor_id FROM public.items WHERE public.items.id = reports.item_id)
    );

DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
CREATE POLICY "Users can view their own reports"
    ON public.reports FOR SELECT
    TO authenticated
    USING (auth.uid() = reporter_id);

-- ==============================================================================
-- 9. Storage Bucket Configuration for Item Images
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'item-images',
    'item-images',
    true,
    5242880, -- 5MB in bytes
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

-- Storage bucket RLS policies
DROP POLICY IF EXISTS "Public read access for item images" ON storage.objects;
CREATE POLICY "Public read access for item images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'item-images');

DROP POLICY IF EXISTS "Authenticated users can upload item images" ON storage.objects;
CREATE POLICY "Authenticated users can upload item images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'item-images');

DROP POLICY IF EXISTS "Users can delete their own item images" ON storage.objects;
CREATE POLICY "Users can delete their own item images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'item-images' AND auth.uid() = owner);
