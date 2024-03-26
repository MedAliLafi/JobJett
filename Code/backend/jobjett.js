const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const { userRoutes, registerUser, loginUser } = require('./user.js');
const {candidateRoutes, getCandidateIdFromToken} = require('./candidate.js');
const {employerRoutes, getEmployerIdFromToken} = require('./employer.js');
const jobofferRoutes = require('./joboffer.js');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

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

// Middleware to verify JWT token for candidates
function authenticateCandidateToken(req, res, next) {
  if (req.path === '/loginCandidate') {
    return next(); // Skip authentication for login route
  }

  const token = req.cookies.token; // Retrieve token from cookies
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded.user; // Extract the user object from the decoded token
    // Check if the decoded token represents a candidate
    if (req.user.UserType === 'Candidate') {
      next();
    } else {
      return res.sendStatus(403); // Forbidden
    }
  });
}

// Middleware to verify JWT token for employers
function authenticateEmployerToken(req, res, next) {
  if (req.path === '/loginEmployer') {
    return next(); // Skip authentication for login route
  }

  const token = req.cookies.token; // Retrieve token from cookies
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded.user; // Extract the user object from the decoded token
    // Check if the decoded token represents an employer
    if (req.user.UserType === 'Employer') {
      next();
    } else {
      return res.sendStatus(403); // Forbidden
    }
  });
}

// Routes
app.use('/User', userRoutes);
app.use('/Candidate', authenticateCandidateToken, candidateRoutes);
app.use('/Employer', authenticateEmployerToken, employerRoutes);
app.use('/Employer/addJobOffer', authenticateEmployerToken, jobofferRoutes);

// Starting the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
