
-- Seed Ranks (from guide-levels.ts)
INSERT INTO ranks (id, label, min_trips, badge_style, sequence) VALUES
('Traveler', 'Traveler', 0, 'hidden', 1),
('Explorer', 'Explorer', 5, 'bg-gradient-to-r from-orange-600 to-amber-700 text-white border-2 border-white shadow-xl rotate-1 rounded-xl', 2),
('Pathfinder', 'Pathfinder', 20, 'bg-gradient-to-tr from-slate-700 to-slate-500 text-white border-4 border-slate-200 shadow-2xl skew-x-[-10deg] rounded-sm', 3),
('Trailblazer', 'Trailblazer', 50, 'bg-gradient-to-b from-yellow-400 to-yellow-600 text-white border-[3px] border-yellow-100 shadow-[0_0_15px_rgba(234,179,8,0.6)] rounded-full tracking-widest', 4)
ON CONFLICT (id) DO UPDATE SET
    min_trips = EXCLUDED.min_trips,
    badge_style = EXCLUDED.badge_style,
    sequence = EXCLUDED.sequence;

-- Seed Achievements (from badges.ts)
-- Note: Simplified criteria for now.
INSERT INTO achievements (id, label, description, icon_name, color_class, criteria) VALUES
('first_trip', 'First Step', 'Created their first trip.', 'Map', 'text-blue-500 bg-blue-50 border-blue-200', '{"type": "trip_count", "threshold": 1}'),
('veteran', 'Veteran Guide', 'Has been guiding for over a year.', 'Award', 'text-purple-500 bg-purple-50 border-purple-200', '{"type": "tenure_days", "threshold": 365}'),
('top_rated', 'Top Rated', 'Maintains a 5-star rating.', 'Star', 'text-yellow-500 bg-yellow-50 border-yellow-200', '{"type": "rating", "threshold": 5.0}'),
('fast_responder', 'Fast Responder', 'Replies to messages within an hour.', 'Zap', 'text-orange-500 bg-orange-50 border-orange-200', '{"type": "response_time", "threshold": 60}'),
('community_pillar', 'Community Pillar', 'Active contributor to the community.', 'Users', 'text-green-500 bg-green-50 border-green-200', '{"type": "manual", "threshold": 0}')
ON CONFLICT (id) DO UPDATE SET
    label = EXCLUDED.label,
    description = EXCLUDED.description,
    icon_name = EXCLUDED.icon_name,
    color_class = EXCLUDED.color_class,
    criteria = EXCLUDED.criteria;
