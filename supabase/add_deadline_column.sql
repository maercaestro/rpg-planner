-- Add deadline column to quests table
ALTER TABLE quests ADD COLUMN IF NOT EXISTS deadline DATE;

-- Add comment for documentation
COMMENT ON COLUMN quests.deadline IS 'Optional deadline date for quest completion';
