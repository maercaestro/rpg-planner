# Database Schema Documentation

## Overview
This document describes the Supabase database schema for the RPG Life Gamification Dashboard.

---

## Tables

### 1. `profiles` Table
Stores user profile information and stats.

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT,
  class TEXT DEFAULT 'Neural Alchemist',
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  stats JSONB DEFAULT '{
    "INT": 0,
    "WLT": 0,
    "STR": 0,
    "DEX": 0,
    "WIS": 0
  }'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view and update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

---

### 2. `quests` Table
Stores all quests with their attributes and scores.

```sql
CREATE TABLE quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  gives_int BOOLEAN DEFAULT false,
  gives_wlt BOOLEAN DEFAULT false,
  gives_str BOOLEAN DEFAULT false,
  score INTEGER NOT NULL,
  rank TEXT NOT NULL CHECK (rank IN ('LEGENDARY', 'EPIC', 'COMMON')),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only manage their own quests
CREATE POLICY "Users can view own quests"
  ON quests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quests"
  ON quests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quests"
  ON quests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quests"
  ON quests FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_quests_user_id ON quests(user_id);
CREATE INDEX idx_quests_score ON quests(score DESC);
CREATE INDEX idx_quests_completed ON quests(is_completed);
CREATE INDEX idx_quests_user_incomplete_score ON quests(user_id, is_completed, score DESC);
```

---

## JSONB Structure

### `profiles.stats`
```json
{
  "INT": 92,   // Intelligence (max points from quests)
  "WLT": 68,   // Wealth (max points from quests)
  "STR": 75,   // Strength (max points from quests)
  "DEX": 88,   // Dexterity (future use)
  "WIS": 85    // Wisdom (future use)
}
```

---

## RPC Functions

### `complete_quest(quest_id UUID, user_id UUID)`
Located in: `/supabase/complete_quest.sql`

**Purpose**: Safely complete a quest and update user stats.

**Logic**:
1. Validates quest exists and belongs to user
2. Marks quest as completed
3. Increments user XP by quest score
4. Updates user stats JSONB based on quest attributes:
   - INT +10 if `gives_int = true`
   - WLT +7 if `gives_wlt = true`
   - STR +4 if `gives_str = true`

**Returns**: JSON object with success status and updated data

**Usage**:
```javascript
const { data, error } = await supabase.rpc('complete_quest', {
  quest_id: 'uuid-here',
  user_id: 'uuid-here'
});
```

---

## Weighted Decision Matrix

### Quest Scoring System

Quests are scored based on stat improvements:

| Stat | Weight | Description |
|------|--------|-------------|
| INT  | 10 pts | Intelligence - Learning, coding, mental work |
| WLT  | 7 pts  | Wealth - Financial goals, career advancement |
| STR  | 4 pts  | Strength - Physical fitness, health |

**Total Score** = Sum of selected attributes

Example:
- Quest with INT + WLT = 17 points (LEGENDARY)
- Quest with WLT + STR = 11 points (EPIC)
- Quest with only STR = 4 points (COMMON)

### Quest Ranks

| Rank      | Score Range | Color        |
|-----------|-------------|--------------|
| LEGENDARY | 16+ points  | Gold/Amber   |
| EPIC      | 11-15 pts   | Purple       |
| COMMON    | 0-10 pts    | Gray/Slate   |

---

## Setup Instructions

### 1. Run SQL Commands in Supabase Dashboard

1. Go to Supabase Dashboard → SQL Editor
2. Create the tables:
   - Run the `profiles` table creation SQL
   - Run the `quests` table creation SQL
3. Create the RPC function:
   - Run `/supabase/complete_quest.sql`

### 2. Enable Realtime (Optional)

For live updates, enable Realtime on tables:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE quests;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
```

### 3. Create Triggers for `updated_at`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quests_updated_at
  BEFORE UPDATE ON quests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## Environment Variables

Add to `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Notes

- All queries automatically filter by `auth.uid()` via RLS policies
- Stats are stored as JSONB for flexibility
- Quests use score-based ranking system
- BingoBoard shows top 25 incomplete quests by score
