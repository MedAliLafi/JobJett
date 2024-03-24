const express = require('express');
const jobofferRoutes = express.Router();
const {employerRoutes, getEmployerIdFromToken} = require('./employer.js');

// Route to add a new job offer
jobofferRoutes.post('/addJobOffer', async (req, res) => {
    try {
        // Get employer ID using the new function
        const employerId = await getEmployerIdFromToken(req);

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
    } catch (error) {
        console.error('Error adding job offer:', error);
        return res.status(500).json({ error: 'An error occurred while adding the job offer.' });
    }
});

module.exports = jobofferRoutes;