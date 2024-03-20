const express = require('express');
const jobofferRoutes = express.Router();
const jwt = require('jsonwebtoken');

// Route to add a new job offer
jobofferRoutes.post('/addJobOffer', async (req, res) => {
    try {
        // Decode JWT token to get userId
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'secret_key');
        const userId = decodedToken.userId;

        // Query the database to get the employerId using the userId
        const query = 'SELECT EmployerID FROM Employer WHERE UserID = ?';
        req.pool.query(query, [userId], (error, results) => {
            if (error) {
                console.error('Error querying employer:', error);
                return res.status(500).json({ error: 'An error occurred while fetching employer data.' });
            }

            if (results.length === 0) {
                // User is not an employer
                return res.status(403).json({ error: 'User is not authorized to add job offers.' });
            }

            const employerId = results[0].EmployerID;

            // Inserting a new job offer into the database
            const { title, description, requirements, salary, location } = req.body;
            const jobOfferQuery = 'INSERT INTO JobOffer (EmployerID, Title, Description, Requirements, Salary, Location, DatePosted) VALUES (?, ?, ?, ?, ?, ?, NOW())';
            const jobOfferValues = [employerId, title, description, requirements, salary, location];
            req.pool.query(jobOfferQuery, jobOfferValues, (error, result) => {
                if (error) {
                    console.error('Error adding job offer:', error);
                    return res.status(500).json({ error: 'An error occurred while adding the job offer.' });
                }
                console.log('Job offer added successfully');
                res.status(200).json({ message: 'Job offer added successfully' });
            });
        });
    } catch (error) {
        console.error('Error adding job offer:', error);
        return res.status(500).json({ error: 'An error occurred while adding the job offer.' });
    }
});

module.exports = jobofferRoutes;