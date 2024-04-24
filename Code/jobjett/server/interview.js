const express = require('express');
const { getEmployerIdFromToken, getEmployerInfoById } = require('./employer.js');
const { getCandidateIdFromToken, getCandidateInfoById } = require('./candidate.js');
const interviewRoutes = express.Router();

interviewRoutes.post('/:applicationID/add', async (req, res) => {
    try {
        const pool = req.pool;
        const applicationID = req.params.applicationID;
        const employerId = await getEmployerIdFromToken(pool, req);

        const { interviewDateTime, message, CandidateID } = req.body;

        // Insert new interview entry
        const insertSql = `
            INSERT INTO interview (ApplicationID, CandidateID, EmployerID, InterviewDateTime, Message)
            VALUES (?, ?, ?, ?, ?)`;
        pool.query(insertSql, [applicationID, CandidateID, employerId, interviewDateTime, message], (error, results) => {
                if (error) {
                console.error('Error inserting interview:', error);
                return res.status(500).json({ error: 'An error occurred while scheduling interview.' });
            }
            const interviewID = results.insertId;

            // Update application status
            const statusUpdateSql = `
                UPDATE application
                SET Status = ?
                WHERE applicationID = ?`;
            const updatedStatus = `Interview Scheduled_${interviewID}`;
            pool.query(statusUpdateSql, [updatedStatus, applicationID], (statusUpdateError) => {
                if (statusUpdateError) {
                    console.error('Error updating application status:', statusUpdateError);
                    return res.status(500).json({ error: 'An error occurred while updating application status.' });
                }
                res.status(200).json({ message: 'Interview scheduled successfully.', interviewID });
            });
        });
    } catch (error) {
        console.error('Error scheduling interview:', error);
        return res.status(500).json({ error: 'An error occurred while scheduling interview.' });
    }
});

// Add a GET endpoint to fetch all interviews
interviewRoutes.get('/getinterviews', async (req, res) => {
    try {
        const pool = req.pool;
        const employerId = await getEmployerIdFromToken(pool, req);
        const query = `
            SELECT interview.InterviewID, joboffer.Title, candidate.FirstName, candidate.LastName, interview.InterviewDateTime, interview.Message
            FROM interview
            INNER JOIN application ON interview.ApplicationID = application.ApplicationID
            INNER JOIN joboffer ON application.JobOfferID = joboffer.JobOfferID
            INNER JOIN candidate ON interview.CandidateID = candidate.CandidateID
            WHERE interview.EmployerID = ?`;

        pool.query(query, [employerId], (error, results) => {
            if (error) {
                console.error('Error fetching interviews:', error);
                return res.status(500).json({ error: 'An error occurred while fetching interviews.' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error fetching interviews:', error);
        return res.status(500).json({ error: 'An error occurred while fetching interviews.' });
    }
});

// Add a PUT endpoint to cancel an interview by ID
interviewRoutes.put('/cancel', async (req, res) => {
    try {
        const pool = req.pool;
        const { interviewID } = req.body; // Retrieve interviewID from the request body
        console.log("Received interviewID:", interviewID);

        // Update the status in the application table using a subquery
        const updateSql = `
            UPDATE application
            SET Status = 'Pending'
            WHERE ApplicationID = (
                SELECT ApplicationID
                FROM interview
                WHERE InterviewID = ?
            )`;

        pool.query(updateSql, [interviewID], (error, results) => {
            if (error) {
                console.error('Error canceling interview:', error);
                return res.status(500).json({ error: 'An error occurred while canceling interview.' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Interview not found or already canceled.' });
            }

            res.status(200).json({ message: `Interview canceled successfully.` });
        });
    } catch (error) {
        console.error('Error canceling interview:', error);
        return res.status(500).json({ error: 'An error occurred while canceling interview.' });
    }
});

module.exports = interviewRoutes;