-- 1. Profiles Table (Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    avatar TEXT,
    high_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Test History Table
CREATE TABLE IF NOT EXISTS public.test_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_count INTEGER NOT NULL,
    time_spent INTEGER NOT NULL,
    points_earned INTEGER NOT NULL,
    attempts JSONB NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- 3. User Points Table
CREATE TABLE IF NOT EXISTS public.user_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- 4. Leaderboard Table
CREATE TABLE IF NOT EXISTS public.leaderboard (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT now()
);

-- Functions and Triggers to auto-update Leaderboard and High Score

-- Update Leaderboard on Point Record Insertion
CREATE OR REPLACE FUNCTION update_leaderboard_on_points()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.leaderboard (user_id, total_points, last_updated)
    VALUES (NEW.user_id, NEW.amount, NEW.timestamp)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        total_points = public.leaderboard.total_points + EXCLUDED.total_points,
        last_updated = EXCLUDED.last_updated;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_leaderboard
AFTER INSERT ON public.user_points
FOR EACH ROW EXECUTE FUNCTION update_leaderboard_on_points();

-- Update High Score on Test History Insertion
CREATE OR REPLACE FUNCTION update_high_score()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET high_score = GREATEST(high_score, NEW.score)
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_high_score
AFTER INSERT ON public.test_history
FOR EACH ROW EXECUTE FUNCTION update_high_score();

-- Enable RLS (Row Level Security) - Optional but recommended for production
-- For now, we will assume the user handles security or uses service role for simplicity in this demo.
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.test_history ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
