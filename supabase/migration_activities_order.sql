-- Add order_index column to activities table for drag-and-drop ordering
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS order_index integer DEFAULT 0;

-- Optional: Initialize order_index based on current start_time ordering
-- This is a bit complex in pure SQL without a window function update, 
-- but we can set default to 0. The drag and drop will fix it.
