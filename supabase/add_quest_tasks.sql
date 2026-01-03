-- Add custom weight columns to quests table
ALTER TABLE quests 
ADD COLUMN IF NOT EXISTS weight_int INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS weight_wlt INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS weight_str INTEGER DEFAULT 0;

-- Create quest_tasks table
CREATE TABLE IF NOT EXISTS quest_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for quest_tasks (personal use)
ALTER TABLE quest_tasks DISABLE ROW LEVEL SECURITY;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_quest_tasks_quest_id ON quest_tasks(quest_id);
CREATE INDEX IF NOT EXISTS idx_quest_tasks_completed ON quest_tasks(is_completed);

-- Update existing quests to use custom weights from gives_* boolean fields
UPDATE quests
SET 
  weight_int = CASE WHEN gives_int = true THEN 10 ELSE 0 END,
  weight_wlt = CASE WHEN gives_wlt = true THEN 7 ELSE 0 END,
  weight_str = CASE WHEN gives_str = true THEN 4 ELSE 0 END
WHERE weight_int = 0 AND weight_wlt = 0 AND weight_str = 0;
