const express = require('express');
const router = express.Router();

// simple app data like Lab 5 shop
const appData = {
  appName: 'Health & Fitness Tracker'
};

router.get('/', (req, res) => {
  res.render('home.ejs', appData);
});

router.get('/about', (req, res) => {
  res.render('about.ejs', appData);
});

module.exports = router;
