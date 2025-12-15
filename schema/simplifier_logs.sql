-- Simplifier Logs Table
-- Stores usage logs from the simplifier feature

CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT DEFAULT (datetime('now')),
  level TEXT,
  input_text TEXT,
  output_text TEXT,
  country TEXT,
  user_agent TEXT,
  user_id TEXT
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level);
