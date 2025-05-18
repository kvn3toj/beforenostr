-- Create admin_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'admin',
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow full access to authenticated admins" ON admin_profiles;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON admin_profiles;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON admin_profiles;

-- Create policies
CREATE POLICY "Allow full access to authenticated admins" ON admin_profiles
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create or replace trigger function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and create it
DROP TRIGGER IF EXISTS set_updated_at ON admin_profiles;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON admin_profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at(); 