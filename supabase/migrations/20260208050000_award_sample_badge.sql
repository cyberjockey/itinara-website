
-- Award 'veteran' and 'indonesia-expert' badges to the guide
-- User ID: 4cdc78c3-13be-4eda-b476-3107186016b3

INSERT INTO guide_badges (guide_id, badge_type)
VALUES 
    ('4cdc78c3-13be-4eda-b476-3107186016b3', 'veteran'),
    ('4cdc78c3-13be-4eda-b476-3107186016b3', 'community_pillar')
ON CONFLICT (guide_id, badge_type) DO NOTHING;
