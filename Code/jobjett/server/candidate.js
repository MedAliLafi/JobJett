const express = require('express');
const { registerUser, loginUser } = require('./user.js');
const candidateRoutes = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function getCandidateInfoById(pool, candidateId) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT Candidate.FirstName, User.Email, Candidate.LastName, Candidate.DateOfBirth, Candidate.Phone, Candidate.Address, Candidate.State, Candidate.Country, CV.CV_ID, CV.Summary, CV.Skills, CV.SoftSkills, CV.Domain FROM Candidate INNER JOIN User ON Candidate.UserID = User.UserID LEFT JOIN CV ON Candidate.CandidateID = CV.CandidateID WHERE Candidate.CandidateID = ?', [candidateId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                if (results.length > 0) {
                    const candidateInfo = {
                        firstName: results[0].FirstName,
                        email: results[0].Email,
                        dateOfBirth: results[0].DateOfBirth,
                        lastName: results[0].LastName,
                        phone: results[0].Phone,
                        address: results[0].Address,
                        state: results[0].State,
                        country: results[0].Country,
                        cvId: results[0].CV_ID,
                        summary: results[0].Summary,
                        skills: results[0].Skills,
                        softskills: results[0].SoftSkills,
                        domain: results[0].Domain
                    };
                    resolve(candidateInfo);
                } else {
                    reject(new Error('Candidate not found for the given ID.'));
                }
            }
        });
    });
}

function getCandidateIdFromToken(pool, req) {
    const token = req.cookies.token;
    if (!token) return null;
    const decoded = jwt.verify(token, 'secret_key');
    const userID = decoded.user.UserID;
    return new Promise((resolve, reject) => {
        pool.query('SELECT CandidateID FROM candidate WHERE UserID = ?', [userID], (error, results) => {
            if (error) {
                reject(error);
            } else {
                if (results.length > 0) {
                    resolve(results[0].CandidateID);
                } else {
                    reject(new Error('Candidate not found for the given token.'));
                }
            }
        });
    });
}

// Route to register a new candidate
candidateRoutes.post('/registerCandidate', async (req, res) => {
    const pool = req.pool;
    const { email, password, firstName, lastName, dateOfBirth, phone, address, state, country} = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // First, register the user using the function from user.js module
        registerUser(pool, email, hashedPassword, 'Candidate', async (error, result) => {
            if (error) {
                return res.status(500).json({ error: 'An error occurred while registering the user.' });
            }

            const userID = result.insertId;
            // Now, register the candidate using the user ID obtained
            const sql = 'INSERT INTO Candidate (UserID, FirstName, LastName, DateOfBirth, Phone, Address, State, Country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [userID, firstName, lastName, dateOfBirth, phone, address, state, country];

            pool.query(sql, values, async (error, candidateResult) => {
                if (error) {
                    console.error('Error registering candidate:', error);
                    return res.status(500).json({ error: 'An error occurred while registering the candidate.' });
                }
                
                // Insert a new CV record
                const cvSql = 'INSERT INTO CV (CandidateID, Summary, Skills, Searchable) VALUES (?, ?, ?, ?)';
                const cvValues = [candidateResult.insertId, '', '', 'false'];

                pool.query(cvSql, cvValues, (cvError, cvResult) => {
                    if (cvError) {
                        console.error('Error adding CV:', cvError);
                        return res.status(500).json({ error: 'An error occurred while adding the CV.' });
                    }
                    
                    // Update the candidate record with the CV_ID
                    const updateSql = 'UPDATE Candidate SET CV_ID = ? WHERE CandidateID = ?';
                    const updateValues = [cvResult.insertId, candidateResult.insertId];

                    pool.query(updateSql, updateValues, (updateError, updateResult) => {
                        if (updateError) {
                            console.error('Error updating candidate record with CV_ID:', updateError);
                            return res.status(500).json({ error: 'An error occurred while updating the candidate record.' });
                        }
                        console.log('Candidate registered successfully');
                        res.status(200).json({ message: 'Candidate registered successfully' });
                    });
                });
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
            if (user.UserType !== 'Candidate') {
                console.log('User is not a candidate');
                return res.status(401).json({ error: 'User is not a candidate.' });
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

// Route to get candidate information
candidateRoutes.get('/candidateInfo', async (req, res) => {
    try {
        const pool = req.pool;
        const candidateId = await getCandidateIdFromToken(pool, req);
        if (!candidateId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const candidateInfo = await getCandidateInfoById(pool, candidateId);
        res.status(200).json(candidateInfo);
    } catch (error) {
        console.error('Error fetching candidate information:', error);
        res.status(500).json({ error: 'An error occurred while fetching candidate information' });
    }
});

candidateRoutes.put("/updateProfile", async (req, res) => {
    try {
      const pool = req.pool;
      const token = req.cookies.token;
      if (!token) return null;
      const decoded = jwt.verify(token, 'secret_key');
      const userId = decoded.user.UserID;
      const candidateId = await getCandidateIdFromToken(pool, req);
      if (!candidateId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      const {
        firstName,
        lastName,
        email,
        dateOfBirth,
        phone,
        address,
        state,
        country,
      } = req.body;
      const updateQuery = `
      UPDATE Candidate AS c
      JOIN User AS u ON c.UserID = u.UserID
      SET 
          c.FirstName = ?,
          c.LastName = ?,
          u.Email = ?,
          c.DateOfBirth = ?,
          c.Phone = ?,
          c.Address = ?,
          c.State = ?,
          c.Country = ?
      WHERE 
          c.CandidateID = ?
  `;
  
      const updateValues = [
        firstName,
        lastName,
        email,
        dateOfBirth,
        phone,
        address,
        state,
        country,
        candidateId,
      ];
  
      pool.query(updateQuery, updateValues, (error, results) => {
        if (error) {
          console.error("Error updating candidate profile:", error);
          return res.status(500).json({
            error: "An error occurred while updating candidate profile.",
          });
        }
        console.log("Candidate profile updated successfully");
        res
          .status(200)
          .json({ message: "Candidate profile updated successfully" });
      });
    } catch (error) {
      console.error("Error updating candidate profile:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating candidate profile." });
    }
  });

candidateRoutes.get('/candidate/:candidateID', async (req, res) => {
    try {
        const pool = req.pool;
        const candidateID = req.params.candidateID;
        const candidateInfo = await getCandidateInfoById(pool, candidateID);
        res.status(200).json(candidateInfo);
    } catch (error) {
        console.error('Error fetching candidate information:', error);
        res.status(500).json({ error: 'An error occurred while fetching candidate information' });
    }   
});

module.exports = { candidateRoutes, getCandidateIdFromToken, getCandidateInfoById };