-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  onboarded BOOLEAN DEFAULT false,
  event_style INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create calendars table
CREATE TABLE calendars (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  invite_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL
);

-- Create index on invite_code for fast lookups
CREATE INDEX idx_calendars_invite_code ON calendars(invite_code);

-- Create calendar_members table
CREATE TABLE calendar_members (
  calendar_id UUID REFERENCES calendars(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (calendar_id, user_id)
);

-- Create events table
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  calendar_id UUID REFERENCES calendars(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  assigned_to TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on calendar_id and time for efficient queries
CREATE INDEX idx_events_calendar_time ON events(calendar_id, start_time);

-- Create daily_notes table
CREATE TABLE daily_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  calendar_id UUID REFERENCES calendars(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(calendar_id, date)
);

-- Create index on calendar_id and date
CREATE INDEX idx_daily_notes_calendar_date ON daily_notes(calendar_id, date);

-- ===========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_notes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Calendars policies
CREATE POLICY "Users can view calendars they are members of"
  ON calendars FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM calendar_members
      WHERE calendar_members.calendar_id = calendars.id
      AND calendar_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create calendars"
  ON calendars FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Calendar members can update their calendars"
  ON calendars FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM calendar_members
      WHERE calendar_members.calendar_id = calendars.id
      AND calendar_members.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM calendar_members
      WHERE calendar_members.calendar_id = calendars.id
      AND calendar_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Calendar owners can delete their calendars"
  ON calendars FOR DELETE
  USING (auth.uid() = owner_id);

-- Calendar members policies
CREATE POLICY "Users can view members of calendars they belong to"
  ON calendar_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM calendar_members cm
      WHERE cm.calendar_id = calendar_members.calendar_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join calendars"
  ON calendar_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can remove members"
  ON calendar_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM calendar_members
      WHERE calendar_members.calendar_id = calendar_members.calendar_id
      AND calendar_members.user_id = auth.uid()
      AND calendar_members.role = 'admin'
    )
  );

-- Events policies
CREATE POLICY "Members can view events in their calendars"
  ON events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM calendar_members
      WHERE calendar_members.calendar_id = events.calendar_id
      AND calendar_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can create events in their calendars"
  ON events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM calendar_members
      WHERE calendar_members.calendar_id = events.calendar_id
      AND calendar_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can update events in their calendars"
  ON events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM calendar_members
      WHERE calendar_members.calendar_id = events.calendar_id
      AND calendar_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can delete events in their calendars"
  ON events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM calendar_members
      WHERE calendar_members.calendar_id = events.calendar_id
      AND calendar_members.user_id = auth.uid()
    )
  );

-- Daily notes policies
CREATE POLICY "Members can view notes in their calendars"
  ON daily_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM calendar_members
      WHERE calendar_members.calendar_id = daily_notes.calendar_id
      AND calendar_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can create notes in their calendars"
  ON daily_notes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM calendar_members
      WHERE calendar_members.calendar_id = daily_notes.calendar_id
      AND calendar_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can update notes in their calendars"
  ON daily_notes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM calendar_members
      WHERE calendar_members.calendar_id = daily_notes.calendar_id
      AND calendar_members.user_id = auth.uid()
    )
  );

-- ===========================================
-- FUNCTIONS AND TRIGGERS
-- ===========================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to automatically add creator as admin member when creating a calendar
CREATE OR REPLACE FUNCTION public.add_creator_as_admin()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.calendar_members (calendar_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to add creator as admin
CREATE OR REPLACE TRIGGER on_calendar_created
  AFTER INSERT ON calendars
  FOR EACH ROW EXECUTE FUNCTION public.add_creator_as_admin();
