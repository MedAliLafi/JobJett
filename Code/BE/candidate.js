const express = require('express');
const { userRoutes, registerUser } = require('./user.js');
const candidateRoutes = express.Router();
const bcrypt = require('bcrypt');

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
                return res.status(500).json({ error: "Error registering user." });
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
        console.error('Error hashing password:', error);
        return res.status(500).json({ error: 'An error occurred while hashing the password.' });
    }
});

module.exports = candidateRoutes;