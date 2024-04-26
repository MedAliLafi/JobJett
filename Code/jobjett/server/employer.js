const express = require('express');
const { registerUser, loginUser } = require('./user.js');
const employerRoutes = express.Router();
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to get employer information by ID
function getEmployerInfoById(pool, employerId) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT Employer.FirstName, Employer.LastName, Employer.DateOfBirth, Employer.CompanyName, Employer.NumberOfEmployees, User.Email, Employer.Industry, Employer.Phone, Employer.State, Employer.Country, Employer.Address FROM Employer INNER JOIN User ON Employer.UserID = User.UserID WHERE EmployerID = ?', [employerId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                if (results.length > 0) {
                    const employerInfo = {
                        firstname: results[0].firstname,
                        lastname: results[0].lastname,
                        dateOfBirth: results[0].dateOfBirth,
                        companyName: results[0].CompanyName,
                        numberOfEmployees: results[0].numberOfEmployees,
                        email: results[0].Email,
                        industry: results[0].Industry,
                        phone: results[0].Phone,
                        state: results[0].State,
                        country: results[0].Country,
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
    const { email, password, firstname, lastname, dateOfBirth, companyName, industry, numberOfEmployees, phone, state, country, address } = req.body;
    
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

    // Register the user first using the function from user.js module
    registerUser(pool, email, hashedPassword, 'Employer', (error, userResult) => {
        if (error) {
            return res.status(500).json({ error: "Error registering user." });
        }

        const userID = userResult.insertId;
        // Now, register the employer using the user ID obtained
        const sql = 'INSERT INTO Employer (UserID, FirstName, LastName, DateOfBirth, CompanyName, Industry, NumberOfEmployees, Phone, State, Country, Address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [userID, firstname, lastname, dateOfBirth, companyName, industry, numberOfEmployees, phone, state, country, address ];

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
    const { email, password, rememberMe } = req.body;
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
                console.log('User is not an employer');
                return res.status(401).json({ error: 'User is not an employer.' });
            }
            
            const expiresIn = rememberMe ? '30d' : '1d';
            const token = jwt.sign({ user: user}, 'secret_key', { expiresIn });            
            res.cookie('token', token, { httpOnly: true, maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : undefined });
            res.status(200).json({ message: 'Login successful', token: token });
        });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ error: 'An error occurred while logging in.' });
    }
});

// Route to get employer information
employerRoutes.get('/employerInfo', async (req, res) => {
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

employerRoutes.put("/updateProfile", async (req, res) => {
    try {
      const pool = req.pool;
      const token = req.cookies.token;
      if (!token) return null;
      const decoded = jwt.verify(token, 'secret_key');
      const userId = decoded.user.UserID;
      const employerId = await getEmployerIdFromToken(pool, req);
      if (!employerId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      const {
        companyName,
        email,
        industry,
        phone,
        address,
        state,
        country,
      } = req.body;
      const updateQuery = `
        UPDATE Employer AS e
        JOIN User AS u ON e.UserID = u.UserID
        SET 
            e.CompanyName = ?,
            u.Email = ?,
            e.Industry = ?,
            e.Phone = ?,
            e.Address = ?,
            e.State = ?,
            e.Country = ?
        WHERE 
            e.EmployerID = ?
    `;
  
      const updateValues = [
        companyName,
        email,
        industry,
        phone,
        address,
        state,
        country,
        employerId,
      ];
  
      pool.query(updateQuery, updateValues, (error, results) => {
        if (error) {
          console.error("Error updating employer profile:", error);
          return res.status(500).json({
            error: "An error occurred while updating employer profile.",
          });
        }
        console.log("Employer profile updated successfully");
        res
          .status(200)
          .json({ message: "Employer profile updated successfully" });
      });
    } catch (error) {
      console.error("Error updating employer profile:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating employer profile." });
    }
  });
  

module.exports = { employerRoutes, getEmployerIdFromToken, getEmployerInfoById };