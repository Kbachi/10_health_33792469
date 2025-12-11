const express = require('express');
const router = express.Router();

// I reuse the same pattern as redirectLogin in auth.js
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  next();
};

// Add workout form
router.get('/add', redirectLogin, (req, res) => {
  res.render('add_workout.ejs', { appName: 'Health & Fitness Tracker' });
});

// Handle workout add (POST)
router.post('/added', redirectLogin, (req, res, next) => {
  const { workout_date, activity, duration_minutes, notes } = req.body;

  const sql =
    'INSERT INTO workouts (user_id, workout_date, activity, duration_minutes, notes) VALUES (?,?,?,?,?)';
  const params = [
    req.session.userId,
    workout_date,
    activity,
    duration_minutes,
    notes
  ];

  db.query(sql, params, (err) => {
    if (err) {
      return next(err);
    }

    // Redirect to homepage WITH a query string
    res.redirect('/?added=1');
  });
});

// Search workouts
router.get('/search', redirectLogin, (req, res, next) => {
  const q = req.query.q || '';

  if (!q) {
    return res.render('search_workout.ejs', {
      appName: 'Health & Fitness Tracker',
      q: '',
      workouts: []
    });
  }

  const sql = `
    SELECT * FROM workouts
    WHERE user_id = ?
      AND (activity LIKE ? OR notes LIKE ?)
    ORDER BY workout_date DESC
  `;

  const like = `%${q}%`;

  db.query(sql, [req.session.userId, like, like], (err, rows) => {
    if (err) {
      return next(err);
    }

    res.render('search_workout.ejs', {
      appName: 'Health & Fitness Tracker',
      q,
      workouts: rows
    });
  });
});

module.exports = router;
