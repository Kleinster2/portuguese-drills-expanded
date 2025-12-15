-- Migration: Add session tracking and completion status
-- Adds session_id and is_complete columns to placement_test_results

ALTER TABLE placement_test_results ADD COLUMN session_id TEXT;
ALTER TABLE placement_test_results ADD COLUMN is_complete BOOLEAN DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_session_id ON placement_test_results(session_id);
CREATE INDEX IF NOT EXISTS idx_is_complete ON placement_test_results(is_complete);
