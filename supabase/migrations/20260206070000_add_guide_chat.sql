-- ============================================
-- Ask Your Local Guide: Chat Feature Schema
-- ============================================
-- Creates tables for tourist-guide conversations
-- NOTE: We use the existing source_template_id column in trips table
-- (set when users create trips from curated templates)

-- 2. Create guide_conversations table
-- ============================================
CREATE TABLE IF NOT EXISTS guide_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
    guide_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    tourist_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
    
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_message_at TIMESTAMPTZ,
    
    -- Ensure one conversation per trip
    UNIQUE(trip_id)
);

-- 3. Create guide_messages table
-- ============================================
CREATE TABLE IF NOT EXISTS guide_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES guide_conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('tourist', 'guide')),
    
    content TEXT NOT NULL,
    
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Enable RLS
-- ============================================
ALTER TABLE guide_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_messages ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for guide_conversations
-- ============================================

-- Tourists can view their own conversations
CREATE POLICY "Tourists view own conversations"
    ON guide_conversations FOR SELECT
    USING (auth.uid() = tourist_id);

-- Guides can view conversations assigned to them
CREATE POLICY "Guides view assigned conversations"
    ON guide_conversations FOR SELECT
    USING (auth.uid() = guide_id);

-- Tourists can create conversations for their trips
CREATE POLICY "Tourists create conversations"
    ON guide_conversations FOR INSERT
    WITH CHECK (auth.uid() = tourist_id);

-- Guides can update conversation status
CREATE POLICY "Guides update conversation status"
    ON guide_conversations FOR UPDATE
    USING (auth.uid() = guide_id);

-- 6. RLS Policies for guide_messages
-- ============================================

-- Users can view messages in their conversations
CREATE POLICY "View messages in own conversations"
    ON guide_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM guide_conversations 
            WHERE id = conversation_id 
            AND (tourist_id = auth.uid() OR guide_id = auth.uid())
        )
    );

-- Users can insert messages to their conversations
CREATE POLICY "Send messages to own conversations"
    ON guide_messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM guide_conversations 
            WHERE id = conversation_id 
            AND (tourist_id = auth.uid() OR guide_id = auth.uid())
        )
    );

-- Users can update (mark as read) messages in their conversations
CREATE POLICY "Update messages in own conversations"
    ON guide_messages FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM guide_conversations 
            WHERE id = conversation_id 
            AND (tourist_id = auth.uid() OR guide_id = auth.uid())
        )
    );

-- 7. Function to update last_message_at on new message
-- ============================================
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE guide_conversations
    SET last_message_at = NEW.created_at, updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updating last_message_at
DROP TRIGGER IF EXISTS on_guide_message_created ON guide_messages;
CREATE TRIGGER on_guide_message_created
    AFTER INSERT ON guide_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_last_message();

-- 8. Enable Realtime for messages
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE guide_messages;

-- 9. Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_guide_conversations_guide_id ON guide_conversations(guide_id);
CREATE INDEX IF NOT EXISTS idx_guide_conversations_tourist_id ON guide_conversations(tourist_id);
CREATE INDEX IF NOT EXISTS idx_guide_conversations_last_message ON guide_conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_guide_messages_conversation_id ON guide_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_guide_messages_created_at ON guide_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_trips_source_template_id ON trips(source_template_id);

-- ============================================
-- Migration Complete
-- ============================================
