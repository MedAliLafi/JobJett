const express = require('express');
const { getEmployerIdFromToken, getEmployerInfoById } = require('./employer.js');
const { getCandidateIdFromToken, getCandidateInfoById } = require('./candidate.js');
const jobofferRoutes = express.Router();

// Route to add a new job offer
jobofferRoutes.post('/addJobOffer', async (req, res) => {
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

// Route to get job offers made by the employer
jobofferRoutes.get('/joboffers', async (req, res) => {
    try {
        const pool = req.pool;
        const employerId = await getEmployerIdFromToken(pool, req);
        if (!employerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Fetch job offers from the database using Employer ID
        const sql = 'SELECT * FROM joboffer WHERE EmployerID = ?';
        pool.query(sql, [employerId], (error, results) => {
            if (error) {
                console.error('Error fetching job offers:', error);
                return res.status(500).json({ error: 'An error occurred while fetching job offers.' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error fetching job offers:', error);
        return res.status(500).json({ error: 'An error occurred while fetching job offers.' });
    }
});

// Route to get applications by Candidate ID
jobofferRoutes.get('/candidate_applications', async (req, res) => {
    try {
        const pool = req.pool;
        const candidateId = await getCandidateIdFromToken(pool, req);
        if (!candidateId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Fetch applications from the database using Candidate ID
        const sql = 'SELECT * FROM application WHERE CandidateID = ?';
        pool.query(sql, [candidateId], (error, results) => {
            if (error) {
                console.error('Error fetching candidate applications:', error);
                return res.status(500).json({ error: 'An error occurred while fetching candidate applications.' });
            }

            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error fetching candidate applications:', error);
        return res.status(500).json({ error: 'An error occurred while fetching candidate applications.' });
    }
});

// Route to get job offer details by ID
jobofferRoutes.get('/:jobofferId', async (req, res) => {
    try {
        const pool = req.pool;
        const jobofferId = req.params.jobofferId;
        console.log('Job Offer ID:', jobofferId);

        // Fetch job offer details from the database using jobofferId
        const sql = 'SELECT * FROM joboffer WHERE JobOfferID = ?';
        pool.query(sql, [jobofferId], (error, results) => {
            if (error) {
                console.error('Error fetching job offer details:', error);
                return res.status(500).json({ error: 'An error occurred while fetching job offer details.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Job offer not found.' });
            }

            const jobofferDetails = results[0];
            res.status(200).json(jobofferDetails);
        });
    } catch (error) {
        console.error('Error fetching job offer details:', error);
        return res.status(500).json({ error: 'An error occurred while fetching job offer details.' });
    }
});

// Route to get applications submitted for a specific job offer
jobofferRoutes.get('/:jobofferId/applications', async (req, res) => {
    try {
        const pool = req.pool;
        const jobofferId = req.params.jobofferId;
        // Fetch applications from the database using Job Offer ID
        const sql = 'SELECT * FROM application WHERE JobOfferID = ?';
        pool.query(sql, [jobofferId], (error, results) => {
            if (error) {
                console.error('Error fetching applications:', error);
                return res.status(500).json({ error: 'An error occurred while fetching applications.' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        return res.status(500).json({ error: 'An error occurred while fetching applications.' });
    }
});


// Route to apply for a job offer
jobofferRoutes.post('/:jobofferId/apply', async (req, res) => {
    try {
        const pool = req.pool;
        const candidateId = await getCandidateIdFromToken(pool, req);
        if (!candidateId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { description } = req.body;
        const jobOfferId = req.params.jobofferId;
        const candidateInfo = await getCandidateInfoById(pool, candidateId);
        const cvId = candidateInfo.cvId;
        const dateApplied = new Date().toISOString().split('T')[0];
        const status = 'Pending';

        // Insert application data into the database
        const sql = 'INSERT INTO application (CandidateID, CV_ID, JobOfferID, Description, Status, DateApplied) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [candidateId, cvId, jobOfferId, description, status, dateApplied];
        pool.query(sql, values, (error, result) => {
            if (error) {
                console.error('Error applying for job offer:', error);
                return res.status(500).json({ error: 'An error occurred while applying for the job offer.' });
            }
            console.log('Application submitted successfully');
            res.status(200).json({ message: 'Application submitted successfully' });
        });
    } catch (error) {
        console.error('Error applying for job offer:', error);
        return res.status(500).json({ error: 'An error occurred while applying for the job offer.' });
    }
});


module.exports = jobofferRoutes;