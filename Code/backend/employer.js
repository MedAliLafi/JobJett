const express = require('express');
const { registerUser, loginUser } = require('./user.js');
const employerRoutes = express.Router();
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to get employer information by ID
function getEmployerInfoById(pool, employerId) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT Employer.CompanyName, User.Email, Employer.Industry, Employer.Phone, Employer.Address FROM Employer INNER JOIN User ON Employer.UserID = User.UserID WHERE EmployerID = ?', [employerId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                if (results.length > 0) {
                    const employerInfo = {
                        companyName: results[0].CompanyName,
                        email: results[0].Email,
                        industry: results[0].Industry,
                        phone: results[0].Phone,
                        address: results[0].Address
                    };
                    resolve(employerInfo);
                } else {
                    reject(new Error('Employer not found for the given ID.'));
                }
            }
        });
    });
}

function getEmployerIdFromToken(pool, req) {
    const token = req.cookies.token;
    if (!token) return null;
    const decoded = jwt.verify(token, 'secret_key');
    const userID = decoded.user.UserID;
    return new Promise((resolve, reject) => {
        pool.query('SELECT EmployerID FROM employer WHERE UserID = ?', [userID], (error, results) => {
            if (error) {
                reject(error);
            } else {
                if (results.length > 0) {
                    resolve(results[0].EmployerID);
                } else {
                    reject(new Error('Employer not found for the given token.'));
                }
            }
        });
    });
}

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

// Route to get employer information
employerRoutes.get('/profile', async (req, res) => {
    try {
        const pool = req.pool;
        const employerId = await getEmployerIdFromToken(pool, req);
        if (!employerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const employerInfo = await getEmployerInfoById(pool, employerId);
        res.status(200).json(employerInfo);
    } catch (error) {
        console.error('Error fetching employer information:', error);
        res.status(500).json({ error: 'An error occurred while fetching employer information' });
    }
});

// Route to add a new job offer
employerRoutes.post('/addJobOffer', async (req, res) => {
    try {
        const pool = req.pool;
        const employerId = await getEmployerIdFromToken(pool, req);
        if (!employerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Extract job offer data from the request body
        const { jobTitle, jobLocationType, jobType, payType, pay, payFrequency, jobDescription } = req.body;
        const salary = `${payType}_${pay}_${payFrequency}`;

        // Construct the job offer object
        const jobOfferData = {
            EmployerID: employerId,
            Title: jobTitle,
            Description: jobDescription,
            Type: jobType,
            Salary: salary,
            Location: jobLocationType,
            DatePosted: new Date().toISOString().split('T')[0] // Current date as DatePosted
        };

        // Save the job offer data to the database
        const sql = 'INSERT INTO joboffer (EmployerID, Title, Description, Type, Salary, Location, DatePosted) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [
            jobOfferData.EmployerID,
            jobOfferData.Title,
            jobOfferData.Description,
            jobOfferData.Type,
            jobOfferData.Salary,
            jobOfferData.Location,
            jobOfferData.DatePosted
        ];
        pool.query(sql, values, (error, result) => {
            if (error) {
                console.error('Error adding job offer:', error);
                return res.status(500).json({ error: 'An error occurred while adding the job offer database.' });
            }
            console.log('Job offer added successfully');
            res.status(200).json({ message: 'Job offer added successfully' });
        });
    } catch (error) {
        console.error('Error adding job offer:', error);
        return res.status(500).json({ error: 'An error occurred while adding the job offer.' });
    }
});

module.exports = { employerRoutes, getEmployerIdFromToken, getEmployerInfoById };