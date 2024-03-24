const express = require('express');
const { userRoutes, registerUser, loginUser } = require('./user.js');
const candidateRoutes = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Route to register a new candidate
candidateRoutes.post('/registerCandidate', async (req, res) => {
    const pool = req.pool;
    const { username, email, password, firstName, lastName, dateOfBirth, phone, address } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // First, register the user using the function from user.js module
        registerUser(pool, username, email, hashedPassword, 'Candidate', async (error, result) => {
            if (error) {
                console.error('Error registering user:', error);
                return res.status(500).json({ error: 'An error occurred while registering the user.' });
            }

            const userID = result.insertId;
            // Now, register the candidate using the user ID obtained
            const sql = 'INSERT INTO Candidate (UserID, FirstName, LastName, DateOfBirth, Phone, Address) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [userID, firstName, lastName, dateOfBirth, phone, address];

            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.error('Error registering candidate:', error);
                    return res.status(500).json({ error: 'An error occurred while registering the candidate.' });
                }
                console.log('Candidate registered successfully');
                res.status(200).json({ message: 'Candidate registered successfully' });
            });
        });
    } catch (error) {
        console.error('Error registering candidate:', error);
        return res.status(500).json({ error: 'An error occurred while registering the candidate.' });
    }
});

// Route to login candidate
candidateRoutes.post('/loginCandidate', async (req, res) => {
    const pool = req.pool;
    const { email, password } = req.body;
    try {
        loginUser(pool, email, password, (error, result) => {
            if (error) {
                console.error('Error logging in:', error);
                return res.status(500).json({ error: 'An error occurred while logging in.' });
            }
            if (result.error) {
                return res.status(401).json({ error: result.error });
            }
            const user = result.user;
            if (user.UserType !== 'Candidate') {
                console.log('User is not a candidate');
                return res.status(401).json({ error: 'User is not a candidate.' });
            }
            const token = jwt.sign({ userId: user.UserID}, 'secret_key');
            res.status(200).json({ message: 'Login successful', token: token });
        });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ error: 'An error occurred while logging in.' });
    }
});

// Function to decode JWT token and retrieve candidate ID
function getCandidateIdFromToken(req) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'secret_key');
    const userId = decodedToken.userId;

    // Query the database to get the candidateId using the userId
    const query = 'SELECT CandidateID FROM Candidate WHERE UserID = ?';
    return new Promise((resolve, reject) => {
        req.pool.query(query, [userId], (error, results) => {
            if (error) {
                console.error('Error querying candidate:', error);
                reject('An error occurred while fetching candidate data.');
            }

            if (results.length === 0) {
                // User is not an candidate
                reject('User is not authorized to perform this action.');
            }

            const candidateId = results[0].CandidateID;
            resolve(candidateId);
        });
    });
}

module.exports = {candidateRoutes, getCandidateIdFromToken};