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

// Middleware for employer authentication
function isAuthenticatedAsEmployer(req, res, next) {
  // Check if the user is authenticated as an employer
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.redirect('/employer/employer_login.html');
  }

  jwt.verify(token, 'secret_key', (err, decoded) => {
      if (err) {
        return res.redirect('/employer/employer_login.html');
      }

      // Check if the user is an employer
      const userId = decoded.userId;
      const query = 'SELECT * FROM User WHERE UserID = ? AND UserType = "Employer"';
      req.pool.query(query, [userId], (error, results) => {
          if (error || results.length === 0) {
            return res.redirect('/employer/employer_login.html');
          }
          next(); // Proceed to the next middleware or route handler
      });
  });
}

// Employer space route (protected)
app.get('/employer', isAuthenticatedAsEmployer, (req, res) => {
  // Render employer dashboard or any other employer-specific page
  res.send('Welcome to the employer space');
});

// Other employer-specific routes (protected)
app.get('/employer/profile', isAuthenticatedAsEmployer, (req, res) => {
  // Render employer profile page
  res.send('This is your profile page as an employer');
});

// Middleware for candidate authentication
function isAuthenticatedAsCandidate(req, res, next) {
  // Check if the user is authenticated as an candidate
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
      return res.redirect('/candidate/candidate_login.html');
  }

  jwt.verify(token, 'secret_key', (err, decoded) => {
      if (err) {
        return res.redirect('/candidate/candidate_login.html');
      }

      // Check if the user is an candidate
      const userId = decoded.userId;
      const query = 'SELECT * FROM User WHERE UserID = ? AND UserType = "Candidate"';
      req.pool.query(query, [userId], (error, results) => {
          if (error || results.length === 0) {
            return res.redirect('/candidate/candidate_login.html');
          }
          next(); // Proceed to the next middleware or route handler
      });
  });
}

// Candidate space route (protected)
app.get('/candidate', isAuthenticatedAsCandidate, (req, res) => {
  // Render candidate dashboard or any other candidate-specific page
  res.send('Welcome to the candidate space');
});

// Other candidate-specific routes (protected)
app.get('/candidate/profile', isAuthenticatedAsCandidate, (req, res) => {
  // Render candidate profile page
  res.send('This is your profile page as an candidate');
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