const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { userRoutes, registerUser, loginUser } = require('./user.js');
const { candidateRoutes, getCandidateIdFromToken } = require('./candidate.js');
const { employerRoutes, getEmployerIdFromToken } = require('./employer.js');
const cvRoutes = require('./cv.js');
const jobofferRoutes = require('./joboffer.js');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

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

// Function to verify JWT token and check if the user is an employer
function isEmployer(req) {
  const token = req.cookies.token;
  if (!token) return false;

  return new Promise((resolve, reject) => {
    jwt.verify(token, 'secret_key', (err, decoded) => {
      if (err) return reject(err);
      if (decoded.user.UserType === 'Employer') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

// Function to verify JWT token and check if the user is an candidate
function isCandidate(req) {
  const token = req.cookies.token;
  if (!token) return false;

  return new Promise((resolve, reject) => {
    jwt.verify(token, 'secret_key', (err, decoded) => {
      if (err) return reject(err);
      if (decoded.user.UserType === 'Candidate') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

// Middleware to verify JWT token for candidates
async function authenticateCandidateToken(req, res, next) {
  if (req.path === '/loginCandidate' || req.path === '/registerCandidate') {
    return next(); // Skip authentication for login route
  }

  try {
    const isCandidateUser = await isCandidate(req);
    if (!isCandidateUser) {
      return res.sendStatus(403); // Forbidden
    }
    next();
  } catch (error) {
    console.error('Error authenticating candidate token:', error);
    return res.sendStatus(403); // Forbidden
  }
}

// Middleware to verify JWT token for employers
async function authenticateEmployerToken(req, res, next) {
  if (req.path === '/loginEmployer' || req.path === '/registerEmployer') {
    return next(); // Skip authentication for login route
  }
  try {
    const isEmployerUser = await isEmployer(req);
    if (isEmployerUser) {
      return next();
    } else {
      return res.redirect('/Employer/employer_login.html');
    }
  } catch (error) {
    console.error('Error authenticating employer token:', error);
    return res.redirect('/Employer/employer_login.html');
  }
}

// Route to check employer authentication
app.get('/Employer/loginEmployer/checkEmployerAuth', async (req, res) => {
  try {
    const isEmployerUser = await isEmployer(req);
    if (isEmployerUser) {
      res.json({ loggedIn: true });
    } else {
      res.json({ loggedIn: false });
    }
  } catch (error) {
    console.error('Error authenticating employer token:', error);
    res.status(401).json({ loggedIn: false });
  }
});

// Route to check candidate authentication
app.get('/Candidate/loginCandidate/checkCandidateAuth', async (req, res) => {
  try {
    const isCandidateUser = await isCandidate(req);
    if (isCandidateUser) {
      res.json({ loggedIn: true });
    } else {
      res.json({ loggedIn: false });
    }
  } catch (error) {
    console.error('Error authenticating candidate token:', error);
    res.status(401).json({ loggedIn: false });
  }
});

// Route for logout
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).send('Logout successful');
});

app.get('/', (req, res) => {
  res.redirect('/home.html');
});

app.get('/Employer', (req, res) => {
  res.redirect('/Employer/employer_login.html');
});

app.get('/Candidate', (req, res) => {
  res.redirect('/Candidate/candidate_login.html');
});

// Routes
app.use('/User', userRoutes);
app.use('/Candidate', authenticateCandidateToken, candidateRoutes);
app.use('/Employer', authenticateEmployerToken, employerRoutes);
app.use('/Candidate/cv', authenticateCandidateToken, cvRoutes);
app.use('/Employer/JobOffer', authenticateEmployerToken, jobofferRoutes);
app.use('/Candidate/JobOffer', authenticateCandidateToken, jobofferRoutes);

// Starting the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});