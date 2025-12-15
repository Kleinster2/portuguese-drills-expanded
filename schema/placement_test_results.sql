-- Placement Test Results Table
-- Stores detailed results from placement test completions

CREATE TABLE IF NOT EXISTS placement_test_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id TEXT,
  session_id TEXT,
  phase_reached INTEGER,
  topics_mastered INTEGER,
  topics_needs_work INTEGER,
  total_questions INTEGER,
  completion_time_mins INTEGER,
  is_complete BOOLEAN DEFAULT 0,
  country TEXT,
  user_agent TEXT,
  results_json TEXT
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_timestamp ON placement_test_results(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_id ON placement_test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_session_id ON placement_test_results(session_id);
CREATE INDEX IF NOT EXISTS idx_phase_reached ON placement_test_results(phase_reached);
CREATE INDEX IF NOT EXISTS idx_is_complete ON placement_test_results(is_complete);
