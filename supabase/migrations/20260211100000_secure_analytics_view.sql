-- Security Fix: Ensure the view respects RLS policies of the invoking user
-- preventing data leaks if the view owner has elevated privileges.

ALTER VIEW template_referral_analytics SET (security_invoker = true);
