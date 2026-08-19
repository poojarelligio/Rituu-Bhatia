-- =====================================================================
-- Optional seed data — run after schema.sql
-- =====================================================================

INSERT INTO assessment_questions (question, options, sort_order) VALUES
('How do you feel about your finances and career right now?',
 '[{"label":"Very stressed or stuck","points":1},{"label":"Somewhat uncertain","points":2},{"label":"Fairly steady","points":3},{"label":"Confident and growing","points":4}]', 1),
('How would you describe your home or workspace lately?',
 '[{"label":"Chaotic or draining","points":1},{"label":"A bit off, hard to say why","points":2},{"label":"Generally comfortable","points":3},{"label":"Calm and supportive","points":4}]', 2),
('How are your closest relationships feeling?',
 '[{"label":"Strained or distant","points":1},{"label":"Mixed — some tension","points":2},{"label":"Mostly good","points":3},{"label":"Strong and connected","points":4}]', 3),
('How is your energy and general well-being?',
 '[{"label":"Exhausted most days","points":1},{"label":"Up and down","points":2},{"label":"Generally okay","points":3},{"label":"Energized and clear","points":4}]', 4);

INSERT INTO assessment_results (min_score, max_score, title, description) VALUES
(4, 8, 'Your energy needs real support right now', 'Several areas of your life are asking for attention at once. A consultation can help you find where to start.'),
(9, 12, 'You''re carrying some blocks worth addressing', 'Things are manageable but not flowing the way they could. A focused session could clear the biggest blocker.'),
(13, 16, 'You''re in a strong place, with room to grow', 'Your foundation is solid. This is a good time for growth-focused work rather than crisis management.');

-- Create your first admin login by running: node scripts/create-admin.mjs
-- (password is hashed in Node, not safe to write a plaintext hash by hand here)
