const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const mysql = require('mysql2');

dotenv.config();

const app = express();
const port = 8000;

// views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

// parse POST form data
app.use(express.urlencoded({ extended: true }));

// sessions
app.use(
  session({
    secret: 'somerandomblah',
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 600000 }
  })
);

// make session visible in every EJS template
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// database connection
const db = mysql.createPool({
  host: process.env.HEALTH_HOST || 'localhost',
  user: process.env.HEALTH_USER || 'health_app',
  password: process.env.HEALTH_PASSWORD || 'qwertyuiop',
  database: process.env.HEALTH_DATABASE || 'health'
});

global.db = db; // I use this in the route files

// routes
const mainRoutes = require('./routes/main');
const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workout');

app.use('/', mainRoutes);
app.use('/auth', authRoutes);
app.use('/workout', workoutRoutes);

app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(500).send('Something went wrong.');
});

app.listen(port, () => {
  console.log(`Health app listening on port ${port}`);
});
