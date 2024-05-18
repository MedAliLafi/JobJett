const express = require('express');
const { getEmployerIdFromToken, getEmployerInfoById } = require('./employer.js');
const { getCandidateIdFromToken, getCandidateInfoById } = require('./candidate.js');
const jobofferRoutes = express.Router();
const jwt = require('jsonwebtoken');

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
        let aq = additionalQuestions;
        if(aq == ''){
            aq = null;
        }

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
            AdditionalQuestions: aq,
            Description: jobDescription,
            Type: jobType,
            Salary: salary,
            Location: jobLocationType,
            DatePosted: new Date().toISOString().split('T')[0] // Current date as DatePosted
        };

        // Save the job offer data to the database
        const sql = 'INSERT INTO joboffer (EmployerID, Title, Description, Type, Salary, Location, DatePosted, Department, Schedule, ReqEducation, ReqExperience, ReqSkills, ReqSoftSkills, additionalQuestions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
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
            jobOfferData.AdditionalQuestions
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
        const { page = 1, pageSize = 9, jobTitle, companyName, location, sortBy } = req.query;
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
            let selectQuery = 'SELECT joboffer.*, employer.* FROM joboffer';
            selectQuery += ` ${joinClause}`;
            if (whereClause) {
                selectQuery += ` WHERE ${whereClause}`;
            }
            selectQuery += ' ORDER BY DatePosted ' + (sortBy === 'newest' ? 'DESC' : 'ASC');

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

jobofferRoutes.get('/loadcandidates', async (req, res) => {
    try {
        const pool = req.pool;
        const { page = 1, pageSize = 9, keyword, location } = req.query;
        const offset = (page - 1) * pageSize;

        // Build the WHERE clause for filtering based on search parameters
        let whereClause = '';
        const queryParams = [];
        if (keyword) {
            whereClause += '(cv.Summary LIKE ? OR cv.Skills LIKE ? OR cv.SoftSkills LIKE ? OR cv.Domain LIKE ?)';
            const keywordParam = `%${keyword}%`;
            queryParams.push(keywordParam, keywordParam, keywordParam, keywordParam);
        }
        if (location) {
            if (whereClause) whereClause += ' AND ';
            whereClause += '(candidate.Address LIKE ? OR candidate.State LIKE ? OR candidate.Country LIKE ?)';
            const locationParam = `%${location}%`;
            queryParams.push(locationParam, locationParam, locationParam);
        }
        // Filter candidates based on Searchable flag
        if (whereClause) whereClause += ' AND ';
        whereClause += 'cv.Searchable = ?';
        queryParams.push(true);

        // Execute the count query to get the total number of candidates
        let countQuery = 'SELECT COUNT(*) AS totalCount FROM candidate INNER JOIN cv ON candidate.CandidateID = cv.CandidateID';
        if (whereClause) {
            countQuery += ` WHERE ${whereClause}`;
        }
        pool.query(countQuery, queryParams, (error, countResults) => {
            if (error) {
                console.error('Error fetching candidate count:', error);
                return res.status(500).json({ error: 'An error occurred while fetching candidate count.' });
            }
            const totalCount = countResults[0].totalCount;

            // Execute the select query to fetch paginated candidates
            let selectQuery = 'SELECT candidate.*, cv.Summary, cv.Skills, cv.SoftSkills, cv.Domain FROM candidate INNER JOIN cv ON candidate.CandidateID = cv.CandidateID';
            if (whereClause) {
                selectQuery += ` WHERE ${whereClause}`;
            }
            selectQuery += ' LIMIT ?, ?';
            queryParams.push(offset, parseInt(pageSize));
            pool.query(selectQuery, queryParams, (error, selectResults) => {
                if (error) {
                    console.error('Error fetching paginated candidates:', error);
                    return res.status(500).json({ error: 'An error occurred while fetching paginated candidates.' });
                }
                res.header('Access-Control-Expose-Headers', 'X-Total-Count');
                res.setHeader('X-Total-Count', totalCount);
                res.status(200).json(selectResults);
            });
        });
    } catch (error) {
        console.error('Error fetching candidates:', error);
        return res.status(500).json({ error: 'An error occurred while fetching candidates.' });
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

        // Fetch UserID associated with the application
        const getUserIDQuery = `
            SELECT c.UserID
            FROM application a
            INNER JOIN candidate c ON a.CandidateID = c.CandidateID
            WHERE a.applicationID = ?`;
        pool.query(getUserIDQuery, [applicationID], (error, results) => {
            if (error) {
                console.error('Error fetching UserID:', error);
                return res.status(500).json({ error: 'An error occurred while fetching UserID.' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Application not found.' });
            }
            const { UserID } = results[0];

            // Update application status to 'Rejected'
            const updateStatusQuery = `UPDATE application SET Status = 'Denied' WHERE applicationID = ?`;
            pool.query(updateStatusQuery, [applicationID], (updateError) => {
                if (updateError) {
                    console.error('Error updating application status:', updateError);
                    return res.status(500).json({ error: 'An error occurred while updating application status.' });
                }

                // Add notification for application denial
                const notificationSql = 'INSERT INTO notification (UserID, Message, DateTime, `Read`, Link) VALUES (?, ?, ?, ?, ?)';
                const notificationValues = [UserID, `Your job application has been denied.`, new Date().toISOString(), 0, `/candidate/applications/${applicationID}`];
                pool.query(notificationSql, notificationValues, (notificationError, notificationResult) => {
                    if (notificationError) {
                        console.error('Error adding notification:', notificationError);
                        return res.status(500).json({ error: 'An error occurred while adding notification.' });
                    }
                    console.log('Denial notification added successfully');
                    res.status(200).json({ message: 'Application status updated successfully.' });
                });
            });
        });
    } catch (error) {
        console.error('Error updating application status:', error);
        return res.status(500).json({ error: 'An error occurred while updating application status.' });
    }
});

jobofferRoutes.put('/:applicationID/decline', async (req, res) => {
    try {
      const pool = req.pool;
      const applicationID = req.params.applicationID;
  
      // Fetch application details
      const getApplicationQuery = `
        SELECT e.UserID, j.JobOfferID
        FROM application a
        INNER JOIN joboffer j ON a.JobOfferID = j.JobOfferID
        INNER JOIN employer e ON j.EmployerID = e.EmployerID
        WHERE a.ApplicationID = ?`;
      pool.query(getApplicationQuery, [applicationID], (error, results) => {
        if (error) {
          console.error('Error fetching application details:', error);
          return res.status(500).json({ error: 'An error occurred while fetching application details.' });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: 'Application not found.' });
        }
        const { UserID, JobOfferID } = results[0];
  
        // Update application status to 'Declined'
        const updateStatusQuery = `UPDATE application SET Status = 'Declined' WHERE ApplicationID = ?`;
        pool.query(updateStatusQuery, [applicationID], (updateError) => {
          if (updateError) {
            console.error('Error updating application status:', updateError);
            return res.status(500).json({ error: 'An error occurred while updating application status.' });
          }
  
          // Add notification for the employer
          const notificationSql = 'INSERT INTO notification (UserID, Message, DateTime, `Read`, Link) VALUES (?, ?, ?, ?, ?)';
          const notificationValues = [UserID, `Your offer was declined.`, new Date().toISOString(), 0, `/employer/joboffer/${JobOfferID}`];
          pool.query(notificationSql, notificationValues, (notificationError, notificationResult) => {
            if (notificationError) {
              console.error('Error adding notification:', notificationError);
              return res.status(500).json({ error: 'An error occurred while adding notification.' });
            }
            console.log('Decline notification added successfully');
            res.status(200).json({ message: 'Application status updated successfully.' });
          });
        });
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      return res.status(500).json({ error: 'An error occurred while updating application status.' });
    }
  });

jobofferRoutes.delete('/:applicationID/delete', async (req, res) => {
try {
    const pool = req.pool;
    const applicationID = req.params.applicationID;

    // Delete the application from the database
    const deleteApplicationQuery = 'DELETE FROM application WHERE ApplicationID = ?';
    pool.query(deleteApplicationQuery, [applicationID], (error, results) => {
    if (error) {
        console.error('Error deleting application:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the application.' });
    }
    if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Application not found.' });
    }
    console.log('Application deleted successfully.');
    res.status(200).json({ message: 'Application deleted successfully.' });
    });
} catch (error) {
    console.error('Error deleting application:', error);
    return res.status(500).json({ error: 'An error occurred while deleting the application.' });
}
});
  

jobofferRoutes.get('/:jobofferId', async (req, res) => {
    try {
        const pool = req.pool;
        const jobofferId = req.params.jobofferId;

        // Fetch job offer details including employer from the database using jobofferId
        const sql = `
            SELECT joboffer.*, employer.*
            FROM joboffer
            INNER JOIN employer ON joboffer.EmployerID = employer.EmployerID
            WHERE joboffer.JobOfferID = ?`;
        
        pool.query(sql, [jobofferId], (error, results) => {
            if (error) {
                console.error('Error fetching job offer details:', error);
                return res.status(500).json({ error: 'An error occurred while fetching job offer details.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Job offer not found.' });
            }

            // Assuming each job offer has only one employer, you can access the employer details at index 0
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
        application.JobOfferID = ?    AND application.status <> 'Denied';
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
                candidate.*,
                cv.*
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

        const token = req.cookies.token;
        const decoded = jwt.verify(token, 'secret_key');
        const userId = decoded.user.UserID;

        const { description, answers, score } = req.body;
        const jobOfferId = req.params.jobofferId;
        const candidateInfo = await getCandidateInfoById(pool, candidateId);
        const cvId = candidateInfo.cvId;
        const dateApplied = new Date().toISOString().split('T')[0];
        const status = 'Pending';

        // Insert application data into the database
        const sql = 'INSERT INTO application (CandidateID, CV_ID, JobOfferID, Description, Status, DateApplied, Type, Answers, Score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [candidateId, cvId, jobOfferId, description, status, dateApplied, `Applied`, answers, score];
        pool.query(sql, values, async (error, result) => {
            if (error) {
                console.error('Error applying for job offer:', error);
                return res.status(500).json({ error: 'An error occurred while applying for the job offer.' });
            }
            console.log('Application submitted successfully');
            
            // Get job title and employer ID
            const jobOfferQuery = 'SELECT Title, EmployerId FROM joboffer WHERE JobOfferId = ?';
            pool.query(jobOfferQuery, [jobOfferId], async (jobOfferError, [jobOfferResult]) => { // Destructure the result in the callback
                if (jobOfferError || !jobOfferResult) { // Check if there's an error or if result is empty
                    console.error('Error retrieving job offer details:', jobOfferError);
                    return res.status(404).json({ error: 'Job offer not found.' });
                }
                const { Title, EmployerId } = jobOfferResult;
                
                // Get user ID from employer
                const employerQuery = 'SELECT UserId FROM employer WHERE EmployerId = ?';
                pool.query(employerQuery, [EmployerId], async (employerError, [employerResult]) => {
                    if (employerError || !employerResult) { // Check if there's an error or if result is empty
                        console.error('Error retrieving employer details:', employerError);
                        return res.status(404).json({ error: 'Employer not found.' });
                    }
                    const { UserId } = employerResult;
                    
                    // Add notification
                    const notificationSql = 'INSERT INTO notification (UserID, Message, DateTime, `Read`, Link) VALUES (?, ?, ?, ?, ?)';
                    const notificationValues = [UserId, `New applicant for your ${Title} offer!`, dateApplied, 0, `/employer/applications/${jobOfferId}`];
                    pool.query(notificationSql, notificationValues, (notificationError, notificationResult) => {
                        if (notificationError) {
                            console.error('Error adding notification:', notificationError);
                            return res.status(500).json({ error: 'An error occurred while adding notification.' });
                        }
                        console.log('Notification added successfully');
                        res.status(200).json({ message: 'Application submitted successfully' });
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error applying for job offer:', error);
        return res.status(500).json({ error: 'An error occurred while applying for the job offer.' });
    }
});


// Route for fetching work experience
jobofferRoutes.get('/:idType/:ID/work_experience', async (req, res) => {
    try {
        const pool = req.pool;
        const idType = req.params.idType;
        const ID = req.params.ID;

        let sql;
        if (idType === 'application') {
            sql = `
                SELECT * FROM work_experience
                WHERE CandidateID = (
                    SELECT CandidateID FROM application
                    WHERE applicationID = ?
                );`;
        } else if (idType === 'candidate') {
            sql = `
                SELECT * FROM work_experience
                WHERE CandidateID = ?;`;
        } else {
            return res.status(400).json({ error: 'Invalid idType. Use "application" or "candidate".' });
        }

        pool.query(sql, [ID], (error, results) => {
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

// Route for fetching certificates
jobofferRoutes.get('/:idType/:ID/certificates', async (req, res) => {
    try {
        const pool = req.pool;
        const idType = req.params.idType;
        const ID = req.params.ID;

        let sql;
        if (idType === 'application') {
            sql = `
                SELECT * FROM certification
                WHERE CandidateID = (
                    SELECT CandidateID FROM application
                    WHERE applicationID = ?
                );`;
        } else if (idType === 'candidate') {
            sql = `
                SELECT * FROM certification
                WHERE CandidateID = ?;`;
        } else {
            return res.status(400).json({ error: 'Invalid idType. Use "application" or "candidate".' });
        }

        pool.query(sql, [ID], (error, results) => {
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

// Route for fetching education
jobofferRoutes.get('/:idType/:ID/education', async (req, res) => {
    try {
        const pool = req.pool;
        const idType = req.params.idType;
        const ID = req.params.ID;

        let sql;
        if (idType === 'application') {
            sql = `
                SELECT * FROM education
                WHERE CandidateID = (
                    SELECT CandidateID FROM application
                    WHERE applicationID = ?
                );`;
        } else if (idType === 'candidate') {
            sql = `
                SELECT * FROM education
                WHERE CandidateID = ?;`;
        } else {
            return res.status(400).json({ error: 'Invalid idType. Use "application" or "candidate".' });
        }

        pool.query(sql, [ID], (error, results) => {
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

jobofferRoutes.get('/:idType/:ID/candidate-cv', async (req, res) => {
    try {
        const pool = req.pool;
        const idType = req.params.idType;
        const ID = req.params.ID;

        let sql;
        if (idType === 'application') {
            sql = `
                SELECT Candidate.FirstName, User.Email, Candidate.LastName, Candidate.DateOfBirth, Candidate.Phone, Candidate.Address, Candidate.State, Candidate.Country, CV.CV_ID, CV.Summary, CV.Skills, CV.SoftSkills, CV.Domain 
                FROM application a
                JOIN candidate Candidate ON a.CandidateID = Candidate.CandidateID
                JOIN user User ON Candidate.UserID = User.UserID
                LEFT JOIN cv CV ON Candidate.CandidateID = CV.CandidateID
                WHERE a.applicationID = ?;`;
        } else if (idType === 'candidate') {
            sql = `
                SELECT Candidate.FirstName, User.Email, Candidate.LastName, Candidate.DateOfBirth, Candidate.Phone, Candidate.Address, Candidate.State, Candidate.Country, CV.CV_ID, CV.Summary, CV.Skills, CV.SoftSkills, CV.Domain 
                FROM candidate Candidate
                JOIN user User ON Candidate.UserID = User.UserID
                LEFT JOIN cv CV ON Candidate.CandidateID = CV.CandidateID
                WHERE Candidate.CandidateID = ?;`;
        } else {
            return res.status(400).json({ error: 'Invalid idType. Use "application" or "candidate".' });
        }

        pool.query(sql, [ID], (error, results) => {
            if (error) {
                console.error('Error fetching candidate details and CV:', error);
                return res.status(500).json({ error: 'An error occurred while fetching candidate details and CV.' });
            }

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
                res.status(200).json(candidateInfo);
            } else {
                return res.status(404).json({ error: 'Candidate not found for the given ID.' });
            }
        });
    } catch (error) {
        console.error('Error fetching candidate details and CV:', error);
        return res.status(500).json({ error: 'An error occurred while fetching candidate details and CV.' });
    }
});


module.exports = jobofferRoutes;