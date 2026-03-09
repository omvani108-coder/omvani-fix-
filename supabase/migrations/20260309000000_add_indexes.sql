-- Add indexes for query performance at scale
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_user_id ON reminder_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_puja_records_user_id ON puja_records(user_id);
CREATE INDEX IF NOT EXISTS idx_scripture_bookmarks_user_id ON scripture_bookmarks(user_id);
