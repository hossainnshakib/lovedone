-- Photo Reveal App Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Photos table
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    storage_path TEXT NOT NULL,
    image_url TEXT NOT NULL,
    context_note TEXT,
    caption TEXT,
    photo_date DATE,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table (single row)
CREATE TABLE settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    recipient_label TEXT NOT NULL DEFAULT 'For You',
    intro_message TEXT NOT NULL DEFAULT 'A collection of moments, waiting to be seen.',
    closing_message TEXT NOT NULL DEFAULT 'The end.',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings row
INSERT INTO settings (id, recipient_label, intro_message, closing_message)
VALUES (1, 'For You', 'A collection of moments, waiting to be seen.', 'The end.')
ON CONFLICT (id) DO NOTHING;

-- Create index for ordering
CREATE INDEX idx_photos_order ON photos(order_index);

-- Row Level Security (RLS) - disabled for service role access
-- In production, you'd want proper RLS policies

-- Storage bucket (create via Supabase dashboard or CLI)
-- supabase storage create photos --public
