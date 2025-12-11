USE health;

INSERT INTO users (username, first_name, last_name, email, password_hash)
VALUES
(
  'gold',
  'Gold',
  'User',
  'gold@example.com',
  '$2b$10$nMkKl2AuYfS8R8pkEStd1.Qm5kqP1bNiVEJwdO9bDFVYb0mMATe2e'
);

INSERT INTO workouts (user_id, workout_date, activity, duration_minutes, notes)
VALUES
(1, '2025-12-01', 'Running', 30, 'Morning run'),
(1, '2025-12-02', 'Cycling', 45, 'Evening ride'),
(1, '2025-12-03', 'Weights', 40, 'Upper body workout');
