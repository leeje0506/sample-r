export const createResponsesTable = `
  CREATE TABLE IF NOT EXISTS responses (
    id TEXT PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    question_id TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

export const createVisitorIndex = `
  CREATE INDEX IF NOT EXISTS idx_responses_visitor_id
  ON responses(visitor_id)
`;
