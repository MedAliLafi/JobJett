const express = require('express');
const { userRoutes, registerUser, loginUser } = require('./user.js');
const employerRoutes = express.Router();
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');

// Route to register a new employer
employerRoutes.post('/registerEmployer', async (req, res) => {
    const pool = req.pool;
    const { username, email, password, companyName, industry, phone, address } = req.body;
    
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

    // Register the user first using the function from user.js module
    registerUser(pool, username, email, hashedPassword, 'Employer', (error, userResult) => {
        if (error) {
            return res.status(500).json({ error: "Error registering user." });
        }

        const userID = userResult.insertId;
        // Now, register the employer using the user ID obtained
        const sql = 'INSERT INTO Employer (UserID, CompanyName, Industry, Phone, Address) VALUES (?, ?, ?, ?, ?)';
        const values = [userID, companyName, industry, phone, address];

        pool.query(sql, values, (error, employerResult) => {
            if (error) {
                console.error('Error registering employer:', error);
                return res.status(500).json({ error: 'An error occurred while registering the employer.' });
            }
            console.log('Employer registered successfully');
            res.status(200).json({ message: 'Employer registered successfully' });
        });
    });
    }catch (error) {
        console.error('Error hashing password:', error);
        return res.status(500).json({ error: 'An error occurred while hashing the password.' });
    }
});

// Route to login employer
employerRoutes.post('/loginEmployer', async (req, res) => {
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
            if (user.UserType !== 'Employer') {
                console.log('User is not a employer');
                return res.status(401).json({ error: 'User is not a employer.' });
            }
            const token = jwt.sign({ user: user}, 'secret_key');
            res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // One month expiration
            res.status(200).json({ message: 'Login successful', token: token });
        });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ error: 'An error occurred while logging in.' });
    }
});

async function getEmployerIdFromToken(req) {
    const token = req.cookies.token;
    if (!token) return null;
    const decoded = jwt.verify(token, 'secret_key');
    const userID = decoded.user.UserID;
    const query = 'SELECT EmployerID FROM employer WHERE UserID = ?';
    const [rows] = await pool.query(query, [userID]);
    return rows.length > 0 ? rows[0].EmployerID : null;
}

// Route to get employer information
employerRoutes.get('/profile', async (req, res) => {
    try {
        const employerId = await getEmployerIdFromToken(req); // Get employer ID from token
        if (!employerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const employerInfo = await getEmployerInfoById(req.pool, employerId); // Fetch employer info by ID
        res.status(200).json(employerInfo);
    } catch (error) {
        console.error('Error fetching employer information:', error);
        res.status(500).json({ error: 'An error occurred while fetching employer information' });
    }
});

// Function to get employer information by ID
async function getEmployerInfoById(pool, employerId) {
    const query = 'SELECT * FROM Employer WHERE EmployerID = ?';
    const [rows] = await pool.query(query, [employerId]);
    if (rows.length > 0) {
        return {
            companyName: rows[0].CompanyName,
            email: rows[0].Email,
            industry: rows[0].Industry,
            phone: rows[0].Phone,
            address: rows[0].Address
        };
    }
    return null;
}

module.exports = { employerRoutes, getEmployerIdFromToken };