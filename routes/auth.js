const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const basePath = process.env.HEALTH_BASE_PATH || '';

// I use this helper to protect routes login
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect(basePath + '/auth/login');
  }
  next();
};

//  Register 
router.get('/register', (req, res) => {
  res.render('register.ejs', { appName: 'Health & Fitness Tracker' });
});

router.post('/registered', (req, res, next) => {
  const { username, first_name, last_name, email, password } = req.body;

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  if (!passwordPattern.test(password)) {
    return res.send(
      'Registration failed. I need to choose a password with at least 8 characters, one lowercase, one uppercase, one number and one special character.'
    );
  }

  const saltRounds = 10;

  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      return next(err);
    }

    const sql =
      'INSERT INTO users (username, first_name, last_name, email, password_hash) VALUES (?,?,?,?,?)';
    const params = [
      username,
      first_name,
      last_name,
      email,
      hashedPassword
    ];

    db.query(sql, params, (err2) => {
      if (err2) {
        return next(err2);
      }
      res.send(
        'Hello ' +
          first_name +
          ' ' +
          last_name +
          ', I am now registered as ' +
          username +
          '.'
      );
    });
  });
});

//  Login 
router.get('/login', (req, res) => {
  res.render('login.ejs', { appName: 'Health & Fitness Tracker', error: null });
});

router.post('/loggedin', (req, res, next) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], (err, results) => {
    if (err) {
      return next(err);
    }

    if (results.length === 0) {
      return res.render('login.ejs', {
        appName: 'Health & Fitness Tracker',
        error: 'Login failed. Check S username and password.'
      });
    }

    const user = results[0];

    bcrypt.compare(password, user.password_hash, (err2, match) => {
      if (err2) {
        return next(err2);
      }

      if (!match) {
        return res.render('login.ejs', {
          appName: 'Health & Fitness Tracker',
          error: 'Login failed. Check username and password.'
        });
      }

      // save session (Lab 8)
      req.session.userId = user.id;
      req.session.username = user.username;


      // res.redirect('/');
      res.redirect(basePath + '/');
    });
  });
});

//  Logout 
router.get('/logout', redirectLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {

      // return res.redirect('/');
      return res.redirect(basePath + '/');
    }
    // res.send("I am now logged out. <a href='/'>Go to home</a>");
    return res.redirect(basePath + '/');
  });
});

module.exports = router;
