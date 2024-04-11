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
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

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


// Routes
app.use('/User', userRoutes);
app.use('/Candidate', candidateRoutes);
app.use('/Employer', employerRoutes);
app.use('/Candidate/cv', cvRoutes);
app.use('/Employer/JobOffer', jobofferRoutes);
app.use('/Candidate/JobOffer', jobofferRoutes);

// Starting the server
const port = 9000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});