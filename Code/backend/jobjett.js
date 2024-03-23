const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { userRoutes, registerUser, loginUser } = require('./user.js');
const candidateRoutes = require('./candidate.js');
const employerRoutes = require('./employer.js');
const jobofferRoutes = require('./joboffer.js');

const app = express();
app.use(bodyParser.json());

// Serve static files from the 'frontend' directory
app.use(express.static('frontend'));

// Pool configuration
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'jobjett'
});

// Attach pool to request object
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Routes
app.use('/User', userRoutes);
app.use('/Candidate', candidateRoutes);
app.use('/Employer', employerRoutes);
app.use('/Joboffer', jobofferRoutes);

// Starting the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});