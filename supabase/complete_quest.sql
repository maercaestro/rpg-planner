-- =====================================================
-- SUPABASE RPC FUNCTION: complete_quest
-- =====================================================
-- This function safely completes a quest and updates user stats
-- 
-- Usage from React:
-- await supabase.rpc('complete_quest', { 
--   quest_id: 'uuid-here', 
--   user_id: 'uuid-here' 
-- })
-- =====================================================

CREATE OR REPLACE FUNCTION complete_quest(
  quest_id UUID,
  user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  quest_record RECORD;
  current_stats JSONB;
  new_stats JSONB;
  current_xp INTEGER;
  new_xp INTEGER;
BEGIN
  -- 1. Fetch the quest details
  SELECT * INTO quest_record
  FROM quests
  WHERE id = quest_id AND quests.user_id = complete_quest.user_id;

  -- Check if quest exists and belongs to user
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quest not found or does not belong to user';
  END IF;

  -- Check if already completed
  IF quest_record.is_completed = true THEN
    RAISE EXCEPTION 'Quest already completed';
  END IF;

  -- 2. Mark quest as completed
  UPDATE quests
  SET 
    is_completed = true,
    completed_at = NOW()
  WHERE id = quest_id;

  -- 3. Fetch current user profile stats
  SELECT stats, xp INTO current_stats, current_xp
  FROM profiles
  WHERE profiles.id = complete_quest.user_id;

  -- Initialize stats if NULL
  IF current_stats IS NULL THEN
    current_stats := '{
      "INT": 9 ,
      "WLT": 0,
      "STR": 0
    }'::JSONB;
  END IF;

  -- Initialize XP if NULL
  IF current_xp IS NULL THEN
    current_xp := 0;
  END IF;

  -- 4. Calculate new stats based on quest attributes
  new_stats := current_stats;

  -- Increment INT if quest gives INT
  IF quest_record.gives_int = true THEN
    new_stats := jsonb_set(
      new_stats,
      '{INT}',
      to_jsonb(COALESCE((new_stats->>'INT')::INTEGER, 0) + 10)
    );
  END IF;

  -- Increment WLT if quest gives WLT
  IF quest_record.gives_wlt = true THEN
    new_stats := jsonb_set(
      new_stats,
      '{WLT}',
      to_jsonb(COALESCE((new_stats->>'WLT')::INTEGER, 0) + 7)
    );
  END IF;

  -- Increment STR if quest gives STR
  IF quest_record.gives_str = true THEN
    new_stats := jsonb_set(
      new_stats,
      '{STR}',
      to_jsonb(COALESCE((new_stats->>'STR')::INTEGER, 0) + 4)
    );
  END IF;

  -- 5. Calculate new XP
  new_xp := current_xp + quest_record.score;

  -- 6. Update user profile
  UPDATE profiles
  SET 
    stats = new_stats,
    xp = new_xp,
    updated_at = NOW()
  WHERE profiles.id = complete_quest.user_id;

  -- 7. Return success with updated data
  RETURN json_build_object(
    'success', true,
    'quest_id', quest_id,
    'quest_title', quest_record.title,
    'xp_gained', quest_record.score,
    'new_total_xp', new_xp,
    'stats_updated', new_stats,
    'message', 'Quest completed successfully!'
  );

EXCEPTION
  WHEN OTHERS THEN
    -- Return error details
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM,
      'message', 'Failed to complete quest'
    );
END;
$$;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
-- Allow authenticated users to execute this function
GRANT EXECUTE ON FUNCTION complete_quest(UUID, UUID) TO authenticated;

-- =====================================================
-- EXAMPLE USAGE
-- =====================================================
-- SELECT complete_quest(
--   '123e4567-e89b-12d3-a456-426614174000'::UUID,  -- quest_id
--   '987fcdeb-51a2-43f1-9012-345678901234'::UUID   -- user_id
-- );
