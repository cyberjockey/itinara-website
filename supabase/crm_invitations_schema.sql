-- CRM Invitations Schema
-- Tracks pending invitations for CRM users

CREATE TABLE IF NOT EXISTS crm_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'local_guide' CHECK (role IN ('admin', 'local_guide')),
    token TEXT NOT NULL UNIQUE,
    invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_crm_invitations_token ON crm_invitations(token);
CREATE INDEX IF NOT EXISTS idx_crm_invitations_email ON crm_invitations(email);

-- RLS Policies
ALTER TABLE crm_invitations ENABLE ROW LEVEL SECURITY;

-- Only admins can view invitations
CREATE POLICY "Admins can view all invitations"
    ON crm_invitations FOR SELECT
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Only admins can create invitations  
CREATE POLICY "Admins can create invitations"
    ON crm_invitations FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Only admins can update invitations (mark as accepted)
CREATE POLICY "Admins can update invitations"
    ON crm_invitations FOR UPDATE
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Only admins can delete invitations
CREATE POLICY "Admins can delete invitations"
    ON crm_invitations FOR DELETE
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Allow anonymous access for token validation during signup
CREATE POLICY "Anyone can validate invitation token"
    ON crm_invitations FOR SELECT
    USING (token IS NOT NULL AND accepted_at IS NULL AND expires_at > NOW());
