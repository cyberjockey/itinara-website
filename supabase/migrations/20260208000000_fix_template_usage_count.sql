-- Redefine the function with SECURITY DEFINER to allow updates even if user doesn't have direct permission
CREATE OR REPLACE FUNCTION increment_template_use_count(template_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE trip_templates
  SET use_count = COALESCE(use_count, 0) + 1
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
