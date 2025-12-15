CREATE TABLE IF NOT EXISTS shared_simplifications (
  id TEXT PRIMARY KEY,
  level TEXT NOT NULL,
  input_text TEXT NOT NULL,
  output_text TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_created_at ON shared_simplifications(created_at);
