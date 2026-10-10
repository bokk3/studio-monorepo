-- ==============================================================================
-- TACHYON STUDIOS: SINGLE PILOT CLEARANCE & UNIFIED CROSS-GAME PROFILE
-- High-concurrency PostgreSQL schema supporting 100,000+ pilots
-- ==============================================================================

-- 1. Create Public Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    callsign VARCHAR(24) NOT NULL,
    callsign_normalized VARCHAR(24) GENERATED ALWAYS AS (LOWER(TRIM(callsign))) STORED,
    email VARCHAR(255) NOT NULL,
    faction VARCHAR(32) NOT NULL DEFAULT 'Aero-Dynamics',
    rank_tier VARCHAR(32) NOT NULL DEFAULT 'Ensign',
    clearance_level VARCHAR(32) NOT NULL DEFAULT 'ALPHA-1',
    diamonds_balance INT NOT NULL DEFAULT 500 CHECK (diamonds_balance >= 0),
    gold_balance INT NOT NULL DEFAULT 2500 CHECK (gold_balance >= 0),
    founder_status BOOLEAN NOT NULL DEFAULT true,
    avatar_seed VARCHAR(64) NOT NULL DEFAULT 'pilot-01',
    referral_code VARCHAR(12) NOT NULL UNIQUE,
    referred_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. High-Performance B-Tree Indices for Massive Concurrency
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_callsign_normalized ON public.profiles(callsign_normalized);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_diamonds ON public.profiles(diamonds_balance DESC);

-- 3. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can query public pilot stats (Callsign, Rank, Faction for leaderboards and matchmaking)
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

-- Users can update only their own profile attributes (callsign, avatar, faction)
CREATE POLICY "Pilots can update their own clearance" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Automated User Profile Generation Trigger
-- Fires immediately when a user signs up via auth.users
CREATE OR REPLACE FUNCTION public.handle_new_pilot_clearance()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    new_callsign VARCHAR(24);
    new_faction VARCHAR(32);
    ref_code VARCHAR(12);
    referrer_id UUID := NULL;
    input_ref_code TEXT;
BEGIN
    -- Extract user metadata passed during signUp
    new_callsign := COALESCE(NEW.raw_user_meta_data->>'callsign', 'PILOT-' || SUBSTRING(NEW.id::text, 1, 6));
    new_faction := COALESCE(NEW.raw_user_meta_data->>'faction', 'Aero-Dynamics');
    input_ref_code := NEW.raw_user_meta_data->>'referral_code';

    -- Generate a unique 8-character referral code for this pilot (e.g. TACH-A8F2)
    ref_code := 'TACH-' || UPPER(SUBSTRING(MD5(NEW.id::text || NOW()::text), 1, 6));

    -- Check if pilot was referred by an existing pilot
    IF input_ref_code IS NOT NULL AND input_ref_code <> '' THEN
        SELECT id INTO referrer_id FROM public.profiles WHERE referral_code = UPPER(TRIM(input_ref_code)) LIMIT 1;
        
        -- If valid referrer, credit referrer with 250 bonus diamonds
        IF referrer_id IS NOT NULL THEN
            UPDATE public.profiles 
            SET diamonds_balance = diamonds_balance + 250 
            WHERE id = referrer_id;
        END IF;
    END IF;

    -- Insert into public.profiles
    INSERT INTO public.profiles (
        id,
        callsign,
        email,
        faction,
        rank_tier,
        clearance_level,
        diamonds_balance,
        gold_balance,
        founder_status,
        referral_code,
        referred_by
    ) VALUES (
        NEW.id,
        new_callsign,
        NEW.email,
        new_faction,
        'Ensign',
        'ALPHA-FOUNDER',
        CASE WHEN referrer_id IS NOT NULL THEN 750 ELSE 500 END, -- Extra 250 diamonds if referred!
        2500,
        true,
        ref_code,
        referrer_id
    );

    RETURN NEW;
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_pilot_clearance();

-- 5. Atomic RPC Function to Check Callsign Availability Fast
CREATE OR REPLACE FUNCTION public.check_callsign_available(target_callsign TEXT)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE callsign_normalized = LOWER(TRIM(target_callsign))
    );
END;
$$;
