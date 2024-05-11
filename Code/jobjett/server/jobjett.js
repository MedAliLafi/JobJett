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
const interviewRoutes = require('./interview.js');
const jwt = require('jsonwebtoken');
const schedule = require('node-schedule');

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

// Function to check for interviews scheduled for tomorrow and send notifications
const scheduleInterviewNotifications = (pool) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const query = `
      SELECT interview.InterviewID, interview.CandidateID, interview.EmployerID, candidate.UserId AS CandidateUserId, employer.UserId AS EmployerUserId
      FROM interview
      INNER JOIN candidate ON interview.CandidateID = candidate.CandidateID
      INNER JOIN employer ON interview.EmployerID = employer.EmployerID
      WHERE DATE(interview.InterviewDateTime) = ?`;

  pool.query(query, [tomorrow], (error, results) => {
      if (error) {
          console.error('Error fetching interviews for tomorrow:', error);
          return;
      }
      
      results.forEach(result => {
          const { InterviewID, CandidateID, EmployerID, CandidateUserId, EmployerUserId } = result;

          // Add notification for candidate
          const candidateNotificationSql = 'INSERT INTO notification (UserID, Message, DateTime, `Read`, Link) VALUES (?, ?, ?, ?, ?)';
          const candidateNotificationValues = [CandidateUserId, `You have an interview scheduled for tomorrow.`, new Date().toISOString(), 0, `/candidate/interviews`];

          pool.query(candidateNotificationSql, candidateNotificationValues, (candidateNotificationError, candidateNotificationResult) => {
              if (candidateNotificationError) {
                  console.error('Error adding notification for candidate:', candidateNotificationError);
                  return;
              }
              console.log('Notification added for candidate successfully');
          });

          // Add notification for employer
          const employerNotificationSql = 'INSERT INTO notification (UserID, Message, DateTime, `Read`, Link) VALUES (?, ?, ?, ?, ?)';
          const employerNotificationValues = [EmployerUserId, `You have an interview scheduled for tomorrow with a candidate.`, new Date().toISOString(), 0, `/employer/interviews`];

          pool.query(employerNotificationSql, employerNotificationValues, (employerNotificationError, employerNotificationResult) => {
              if (employerNotificationError) {
                  console.error('Error adding notification for employer:', employerNotificationError);
                  return;
              }
              console.log('Notification added for employer successfully');
          });
      });
  });
};

// Schedule the function to run every day at 15:00
schedule.scheduleJob('00 15 * * *', () => {
  scheduleInterviewNotifications(pool);
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
app.use('/Employer/Interview', interviewRoutes);
app.use('/Candidate/JobOffer', jobofferRoutes);
app.use('/Candidate/Interview', interviewRoutes);

// Starting the server
const port = 9000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});