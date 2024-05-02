const express = require('express');
const { getEmployerIdFromToken, getEmployerInfoById } = require('./employer.js');
const { getCandidateIdFromToken, getCandidateInfoById } = require('./candidate.js');
const interviewRoutes = express.Router();

interviewRoutes.post('/:applicationID/add', async (req, res) => {
    try {
        const pool = req.pool;
        const applicationID = req.params.applicationID;
        const employerId = await getEmployerIdFromToken(pool, req);

        if (!employerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

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
            const updatedStatus = `Interview Scheduled_${interviewID}`;
            const statusUpdateSql = `
                UPDATE application
                SET Status = ?
                WHERE applicationID = ?`;

            pool.query(statusUpdateSql, [updatedStatus, applicationID], async (statusUpdateError) => {
                if (statusUpdateError) {
                    console.error('Error updating application status:', statusUpdateError);
                    return res.status(500).json({ error: 'An error occurred while updating application status.' });
                }

                // Get candidate user ID
                pool.query('SELECT UserId FROM candidate WHERE CandidateId = ?', [CandidateID], (candidateError, candidateResult) => {
                    if (candidateError) {
                        console.error('Error retrieving candidate details:', candidateError);
                        return res.status(500).json({ error: 'An error occurred while retrieving candidate details.' });
                    }

                    if (!candidateResult || candidateResult.length === 0) {
                        console.error('Error retrieving candidate details');
                        return res.status(404).json({ error: 'Candidate not found.' });
                    }
                    const { UserId } = candidateResult[0];

                    // Add notification
                    const notificationSql = 'INSERT INTO notification (UserID, Message, DateTime, `Read`, Link) VALUES (?, ?, ?, ?, ?)';
                    const notificationValues = [UserId, `You've been scheduled for an interview.`, new Date().toISOString(), 0, `/candidate/applications`];

                    pool.query(notificationSql, notificationValues, (notificationError, notificationResult) => {
                        if (notificationError) {
                            console.error('Error adding notification:', notificationError);
                            return res.status(500).json({ error: 'An error occurred while adding notification.' });
                        }
                        console.log('Notification added successfully');
                        res.status(200).json({ message: 'Interview scheduled successfully.', interviewID });
                    });
                });
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

// Add a DELETE endpoint to cancel interviews
interviewRoutes.delete('/cancel', async (req, res) => {
    try {
        const pool = req.pool;
        const employerId = await getEmployerIdFromToken(pool, req);
        const { interviewID } = req.body;

        // Get applicationID associated with the interview and Candidate's UserID
        const getApplicationIDQuery = `
            SELECT i.ApplicationID, c.UserID
            FROM interview i
            INNER JOIN candidate c ON i.CandidateID = c.CandidateID
            WHERE i.InterviewID = ?`;
        pool.query(getApplicationIDQuery, [interviewID], (error, results) => {
            if (error) {
                console.error('Error fetching applicationID:', error);
                return res.status(500).json({ error: 'An error occurred while fetching applicationID.' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Interview not found.' });
            }
            const { ApplicationID, UserID } = results[0];

            // Update application status back to "Pending"
            const updateStatusQuery = `
                UPDATE application
                SET Status = 'Interview Cancelled'
                WHERE ApplicationID = ?`;
            pool.query(updateStatusQuery, [ApplicationID], (updateError) => {
                if (updateError) {
                    console.error('Error updating application status:', updateError);
                    return res.status(500).json({ error: 'An error occurred while updating application status.' });
                }

                // Delete the interview
                const deleteInterviewQuery = `
                    DELETE FROM interview
                    WHERE InterviewID = ? AND EmployerID = ?`;
                pool.query(deleteInterviewQuery, [interviewID, employerId], (deleteError, deleteResults) => {
                    if (deleteError) {
                        console.error('Error deleting interview:', deleteError);
                        return res.status(500).json({ error: 'An error occurred while deleting interview.' });
                    }
                    if (deleteResults.affectedRows === 0) {
                        return res.status(404).json({ error: 'Interview not found.' });
                    }

                    // Add notification for interview cancellation
                    const notificationSql = 'INSERT INTO notification (UserID, Message, DateTime, `Read`, Link) VALUES (?, ?, ?, ?, ?)';
                    const notificationValues = [UserID, `Your interview has been cancelled.`, new Date().toISOString(), 0, `/candidate/applications`];
                    pool.query(notificationSql, notificationValues, (notificationError, notificationResult) => {
                        if (notificationError) {
                            console.error('Error adding notification:', notificationError);
                            return res.status(500).json({ error: 'An error occurred while adding notification.' });
                        }
                        console.log('Cancellation notification added successfully');
                        res.status(200).json({ message: 'Interview canceled successfully.' });
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error canceling interview:', error);
        return res.status(500).json({ error: 'An error occurred while canceling interview.' });
    }
});

interviewRoutes.put('/:interviewID/reschedule', async (req, res) => {
    try {
        const pool = req.pool;
        const employerId = await getEmployerIdFromToken(pool, req);

        if (!employerId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { interviewID } = req.params;
        const { interviewDateTime, message } = req.body;

        // Update interview datetime
        const updateSql = `
            UPDATE interview
            SET InterviewDateTime = ?,
                Message = ?
            WHERE InterviewID = ? AND EmployerID = ?`;

        pool.query(updateSql, [interviewDateTime, message, interviewID, employerId], (error, results) => {
            if (error) {
                console.error('Error rescheduling interview:', error);
                return res.status(500).json({ error: 'An error occurred while rescheduling interview.' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Interview not found.' });
            }

            // Get candidate user ID
            const getCandidateUserIdSql = `
                SELECT UserId FROM candidate
                WHERE CandidateId = (
                    SELECT CandidateID FROM interview WHERE InterviewID = ?
                )`;

            pool.query(getCandidateUserIdSql, [interviewID], (getCandidateUserIdError, candidateResult) => {
                if (getCandidateUserIdError) {
                    console.error('Error retrieving candidate details:', getCandidateUserIdError);
                    return res.status(500).json({ error: 'An error occurred while retrieving candidate details.' });
                }

                if (!candidateResult || candidateResult.length === 0) {
                    console.error('Error retrieving candidate details');
                    return res.status(404).json({ error: 'Candidate not found.' });
                }
                const { UserId } = candidateResult[0];

                // Add new notification for rescheduled interview
                const addNotificationSql = `
                    INSERT INTO notification (UserID, Message, DateTime, \`Read\`, Link)
                    VALUES (?, ?, ?, ?, ?)`;

                const notificationValues = [
                    UserId,
                    'Your interview has been rescheduled.',
                    new Date().toISOString(),
                    0,
                    '/candidate/applications'
                ];

                pool.query(addNotificationSql, notificationValues, (notificationError, notificationResult) => {
                    if (notificationError) {
                        console.error('Error adding notification:', notificationError);
                        return res.status(500).json({ error: 'An error occurred while adding notification.' });
                    }
                    console.log('Notification added successfully');
                    res.status(200).json({ message: 'Interview rescheduled successfully.' });
                });
            });
        });
    } catch (error) {
        console.error('Error rescheduling interview:', error);
        return res.status(500).json({ error: 'An error occurred while rescheduling interview.' });
    }
});


module.exports = interviewRoutes;