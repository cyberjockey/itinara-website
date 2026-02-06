-- ============================================
-- Guide Chat: Notifications & File Attachments
-- ============================================
-- Adds notification system and file attachment support

-- 1. Add file attachment columns to guide_messages
-- ============================================
ALTER TABLE guide_messages
ADD COLUMN IF NOT EXISTS attachment_url TEXT,
ADD COLUMN IF NOT EXISTS attachment_type TEXT CHECK (attachment_type IN ('image', 'document', 'video', NULL)),
ADD COLUMN IF NOT EXISTS attachment_filename TEXT;

COMMENT ON COLUMN guide_messages.attachment_url IS 'Telegram file ID or URL for attached file';
COMMENT ON COLUMN guide_messages.attachment_type IS 'Type of attachment: image, document, or video';
COMMENT ON COLUMN guide_messages.attachment_filename IS 'Original filename of the attachment';

-- 2. Create notifications table
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('new_message', 'trip_update', 'system')),
    title TEXT NOT NULL,
    message TEXT,
    link TEXT,
    read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- For message notifications
    conversation_id UUID REFERENCES guide_conversations(id) ON DELETE CASCADE,
    message_id UUID REFERENCES guide_messages(id) ON DELETE CASCADE
);

-- 3. Create indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_conversation ON notifications(conversation_id) WHERE conversation_id IS NOT NULL;

-- 4. Enable RLS on notifications
-- ============================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users view own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users update own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- System can insert notifications (via trigger)
CREATE POLICY "System creates notifications"
    ON notifications FOR INSERT
    WITH CHECK (true);

-- 5. Function to create message notification
-- ============================================
CREATE OR REPLACE FUNCTION create_message_notification()
RETURNS TRIGGER AS $$
DECLARE
    recipient_id UUID;
    sender_name TEXT;
    trip_id_var UUID;
BEGIN
    -- Get conversation details
    SELECT 
        CASE 
            WHEN NEW.sender_role = 'tourist' THEN gc.guide_id
            ELSE gc.tourist_id
        END,
        gc.trip_id
    INTO recipient_id, trip_id_var
    FROM guide_conversations gc
    WHERE gc.id = NEW.conversation_id;
    
    -- Get sender name
    SELECT full_name INTO sender_name
    FROM profiles
    WHERE id = NEW.sender_id;
    
    -- Create notification for recipient
    INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        link,
        conversation_id,
        message_id
    ) VALUES (
        recipient_id,
        'new_message',
        CASE 
            WHEN NEW.sender_role = 'tourist' THEN 'New message from tourist'
            ELSE 'Message from ' || COALESCE(sender_name, 'your guide')
        END,
        LEFT(NEW.content, 100),
        '/dashboard/trips/' || trip_id_var || '?tab=chat',
        NEW.conversation_id,
        NEW.id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger to create notifications on new messages
-- ============================================
DROP TRIGGER IF EXISTS on_message_create_notification ON guide_messages;
CREATE TRIGGER on_message_create_notification
    AFTER INSERT ON guide_messages
    FOR EACH ROW
    EXECUTE FUNCTION create_message_notification();

-- 7. Enable Realtime for notifications
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ============================================
-- Migration Complete
-- ============================================
