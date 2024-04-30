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
        const { jobTitle, jobDepartment, jobSchedule, reqEducation, reqExperience, reqSkills, reqSoftSkills, additionalQuestions, jobLocationType, jobType, payType, pay, payFrequency, jobDescription } = req.body;
        const salary = `${payType}_${pay}_${payFrequency}`;

        // Construct the job offer object
        const jobOfferData = {
            EmployerID: employerId,
            Title: jobTitle,
            Department: jobDepartment,
            Schedule: jobSchedule,
            ReqEducation: reqEducation,
            ReqExperience: reqExperience,
            ReqSkills: reqSkills,
            ReqSoftSkills: reqSoftSkills,
            AdditionalQuestions: additionalQuestions, // New field
            Description: jobDescription,
            Type: jobType,
            Salary: salary,
            Location: jobLocationType,
            DatePosted: new Date().toISOString().split('T')[0] // Current date as DatePosted
        };

        // Save the job offer data to the database
        const sql = 'INSERT INTO joboffer (EmployerID, Title, Description, Type, Salary, Location, DatePosted, Department, Schedule, ReqEducation, ReqExperience, ReqSkills, ReqSoftSkills, AdditionalQuestions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            jobOfferData.EmployerID,
            jobOfferData.Title,
            jobOfferData.Description,
            jobOfferData.Type,
            jobOfferData.Salary,
            jobOfferData.Location,
            jobOfferData.DatePosted,
            jobOfferData.Department,
            jobOfferData.Schedule,
            jobOfferData.ReqEducation,
            jobOfferData.ReqExperience,
            jobOfferData.ReqSkills,
            jobOfferData.ReqSoftSkills,
            jobOfferData.AdditionalQuestions // New field
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

jobofferRoutes.get('/loadjoboffers', async (req, res) => {
    try {
        const pool = req.pool;        
        const { page = 1, pageSize = 9, jobTitle, companyName, location } = req.query;
        const offset = (page - 1) * pageSize;

        // Build the WHERE clause for filtering based on search parameters
        let whereClause = '';
        const queryParams = [];
        if (jobTitle) {
            whereClause += 'Title LIKE ?';
            queryParams.push(`%${jobTitle}%`);
        }
        if (location) {
            if (whereClause) whereClause += ' AND ';
            whereClause += 'Location LIKE ?';
            queryParams.push(`%${location}%`);
        }

        // Build the JOIN clause to fetch company name from the employer table
        let joinClause = 'INNER JOIN employer ON joboffer.EmployerID = employer.EmployerID';
        if (companyName) {
            if (whereClause) whereClause += ' AND ';
            whereClause += 'employer.CompanyName LIKE ?';
            queryParams.push(`%${companyName}%`);
        }

        // Execute the count query to get the total number of job offers
        let countQuery = 'SELECT COUNT(*) AS totalCount FROM joboffer';
        countQuery += ` ${joinClause}`;
        if (whereClause) {
            countQuery += ` WHERE ${whereClause}`;
        }
        pool.query(countQuery, queryParams, (error, countResults) => {
            if (error) {
                console.error('Error fetching job offer count:', error);
                return res.status(500).json({ error: 'An error occurred while fetching job offer count.' });
            }
            const totalCount = countResults[0].totalCount;

            // Execute the select query to fetch paginated job offers
            let selectQuery = 'SELECT joboffer.*, employer.CompanyName, employer.Logo FROM joboffer';
            selectQuery += ` ${joinClause}`;
            if (whereClause) {
                selectQuery += ` WHERE ${whereClause}`;
            }
            selectQuery += ' LIMIT ?, ?';
            queryParams.push(offset, parseInt(pageSize));
            pool.query(selectQuery, queryParams, (error, selectResults) => {
                if (error) {
                    console.error('Error fetching paginated job offers:', error);
                    return res.status(500).json({ error: 'An error occurred while fetching paginated job offers.' });
                }
                res.header('Access-Control-Expose-Headers', 'X-Total-Count');
                res.setHeader('X-Total-Count', totalCount);
                res.status(200).json(selectResults);
            });
        });
    } catch (error) {
        console.error('Error fetching job offers:', error);
        return res.status(500).json({ error: 'An error occurred while fetching job offers.' });
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
        const sql = `
            SELECT 
                application.*, 
                joboffer.Title AS JobOfferTitle, 
                employer.CompanyName AS CompanyName 
            FROM 
                application 
            INNER JOIN 
                joboffer ON application.JobOfferID = joboffer.JobOfferID 
            INNER JOIN 
                employer ON joboffer.EmployerID = employer.EmployerID 
            WHERE 
                application.CandidateID = ?`;
        pool.query(sql, [candidateId], async (error, results) => {
            if (error) {
                console.error('Error fetching candidate applications:', error);
                return res.status(500).json({ error: 'An error occurred while fetching candidate applications.' });
            }
            // Array to store all the promises
            const promises = results.map(async (application) => {
                if (application.Status.includes('Interview Scheduled')) {
                    const interviewId = parseInt(application.Status.split('_')[2]); // Extract interview ID
                    const interviewSql = 'SELECT InterviewDateTime FROM interview WHERE InterviewID = ?';
                    // Fetch interview date and time
                    const interviewRows = await pool.query(interviewSql, [interviewId]);
                    if (interviewRows.length > 0) {
                        const interviewDateTime = interviewRows[0].InterviewDateTime;
                        application.Status = `Interview scheduled for ${interviewDateTime}`;
                    }
                }
                return application;
            });
            // Wait for all promises to resolve
            const updatedResults = await Promise.all(promises);
            res.status(200).json(updatedResults);
        });
    } catch (error) {
        console.error('Error fetching candidate applications:', error);
        return res.status(500).json({ error: 'An error occurred while fetching candidate applications.' });
    }
});


jobofferRoutes.put('/:applicationID/deny', async (req, res) => {
    try {
        const pool = req.pool;
        const applicationID = req.params.applicationID;
        const sql = `UPDATE application SET Status = 'Rejected' WHERE applicationID = ?`;
        pool.query(sql, [applicationID], (error, results) => {
            if (error) {
                console.error('Error updating application status:', error);
                return res.status(500).json({ error: 'An error occurred while updating application status.' });
            }
            res.status(200).json({ message: 'Application status updated successfully.' });
        });
    } catch (error) {
        console.error('Error updating application status:', error);
        return res.status(500).json({ error: 'An error occurred while updating application status.' });
    }
});


// Route to update application status to "Interview Scheduled"
jobofferRoutes.post('/:jobofferId/schedule-interview/:candidateId', async (req, res) => {
    try {
        const pool = req.pool;
        const jobOfferId = req.params.jobofferId;
        const candidateId = req.params.candidateId;
        const { dateTime } = req.body;

        // Update application status to "Interview Scheduled"
        const sql = 'UPDATE application SET Status = ?, InterviewDateTime = ? WHERE JobOfferID = ? AND CandidateID = ?';
        const values = ['Interview Scheduled', dateTime, jobOfferId, candidateId];
        pool.query(sql, values, (error, result) => {
            if (error) {
                console.error('Error scheduling interview:', error);
                return res.status(500).json({ error: 'An error occurred while scheduling the interview.' });
            }
            console.log('Interview scheduled successfully');
            res.status(200).json({ message: 'Interview scheduled successfully' });
        });
    } catch (error) {
        console.error('Error scheduling interview:', error);
        return res.status(500).json({ error: 'An error occurred while scheduling the interview.' });
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

jobofferRoutes.get('/:jobofferId/applications', async (req, res) => {
    try {
        const pool = req.pool;
        const jobofferId = req.params.jobofferId;
        const sql = `
        SELECT 
        application.*, 
        candidate.firstname, 
        candidate.lastname, 
        candidate.state, 
        candidate.country
    FROM 
        application
    INNER JOIN 
        candidate ON application.CandidateID = candidate.CandidateID
    WHERE 
        application.JobOfferID = ?;
        `;
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

jobofferRoutes.get('/:applicationID/application', async (req, res) => {
    try {
        const pool = req.pool;
        const applicationID = req.params.applicationID;
        const sql = `
            SELECT 
                application.*,
                candidate.firstname, 
                candidate.lastname, 
                candidate.phone, 
                candidate.state, 
                candidate.country, 
                candidate.address,
                cv.summary,
                cv.skills
            FROM 
                application
            INNER JOIN 
                candidate ON application.CandidateID = candidate.CandidateID
            LEFT JOIN 
                cv ON application.CV_ID = cv.CV_ID
            WHERE 
                application.applicationID = ?;`;
        pool.query(sql, [applicationID], (error, results) => {
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

jobofferRoutes.get('/:applicationID/work_experience', async (req, res) => {
    try {
        const pool = req.pool;
        const applicationID = req.params.applicationID;
        const sql = `
            SELECT * FROM work_experience
            WHERE CandidateID = (
                SELECT CandidateID FROM application
                WHERE applicationID = ?
            );`;
        pool.query(sql, [applicationID], (error, results) => {
            if (error) {
                console.error('Error fetching work experience:', error);
                return res.status(500).json({ error: 'An error occurred while fetching work experience.' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error fetching work experience:', error);
        return res.status(500).json({ error: 'An error occurred while fetching work experience.' });
    }
});

jobofferRoutes.get('/:applicationID/certificates', async (req, res) => {
    try {
        const pool = req.pool;
        const applicationID = req.params.applicationID;
        const sql = `
            SELECT * FROM certification
            WHERE CandidateID = (
                SELECT CandidateID FROM application
                WHERE applicationID = ?
            );`;
        pool.query(sql, [applicationID], (error, results) => {
            if (error) {
                console.error('Error fetching certificates:', error);
                return res.status(500).json({ error: 'An error occurred while fetching certificates.' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error fetching certificates:', error);
        return res.status(500).json({ error: 'An error occurred while fetching certificates.' });
    }
});

jobofferRoutes.get('/:applicationID/education', async (req, res) => {
    try {
        const pool = req.pool;
        const applicationID = req.params.applicationID;
        const sql = `
            SELECT * FROM education
            WHERE CandidateID = (
                SELECT CandidateID FROM application
                WHERE applicationID = ?
            );`;
        pool.query(sql, [applicationID], (error, results) => {
            if (error) {
                console.error('Error fetching education:', error);
                return res.status(500).json({ error: 'An error occurred while fetching education.' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error fetching education:', error);
        return res.status(500).json({ error: 'An error occurred while fetching education.' });
    }
});


module.exports = jobofferRoutes;