const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { userRoutes, registerUser, loginUser } = require('./user.js');
const { candidateRoutes, getCandidateIdFromToken } = require('./candidate.js');
const { employerRoutes, getEmployerIdFromToken } = require('./employer.js');
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

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'your_secret_key', (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
  });
}

// Middleware to restrict access to candidates
function restrictToCandidates(req, res, next) {
  if (req.user && req.user.userType === 'Candidate') {
      return next();
  } else {
      return res.sendStatus(403); // Forbidden
  }
}

// Middleware to restrict access to employers
function restrictToEmployers(req, res, next) {
  if (req.user && req.user.userType === 'Employer') {
      return next();
  } else {
      return res.sendStatus(403); // Forbidden
  }
}


// Routes
app.use('/User', userRoutes);
app.use('/Candidate', authenticateCandidateToken, restrictToCandidates, candidateRoutes);
app.use('/Employer', authenticateEmployerToken, restrictToEmployers, employerRoutes);
app.use('/Employer/addJobOffer', authenticateEmployerToken, restrictToEmployers, jobofferRoutes);

// Login route
app.post('/Candidate/login', authenticateCandidateToken, candidateLoginHandler);
app.post('/Employer/login', authenticateEmployerToken, employerLoginHandler);

// Starting the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
