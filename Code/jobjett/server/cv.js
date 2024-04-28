const express = require('express');
const { getCandidateIdFromToken, getCandidateInfoById } = require('./candidate.js');
const cvRoutes = express.Router();

// Route to update CV
cvRoutes.post('/updateCV', async (req, res) => {
    try {
        const pool = req.pool;
        const { summary, skills, softskills, searchable } = req.body;
        const candidateId = await getCandidateIdFromToken(pool, req);
        if (!candidateId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        // Update the CV directly assuming it exists
        const updateSql = 'UPDATE cv SET Summary = ?, Skills = ?, SoftSkills = ?, Searchable = ? WHERE CandidateID = ?';
        const updateValues = [summary, skills, softskills, searchable, candidateId];
        pool.query(updateSql, updateValues, (updateError, updateResult) => {
            if (updateError) {
                console.error('Error updating CV:', updateError);
                return res.status(500).json({ error: 'An error occurred while updating the CV.' });
            }
            res.status(200).json({ message: 'CV updated successfully' });
        });
    } catch (error) {
        console.error('Error updating CV:', error);
        res.status(500).json({ error: 'An error occurred while updating the CV.' });
    }
});

// Route to add a certificate
cvRoutes.post('/addCertificate', async (req, res) => {
    try {
        const pool = req.pool;
        const { cvId, certification, dateIssued, description } = req.body;
        const candidateId = await getCandidateIdFromToken(pool, req);
        if (!candidateId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const sql = 'INSERT INTO certification (CandidateID, CV_ID, certification, DateIssued, description) VALUES (?, ?, ?, ?, ?)';
        const values = [candidateId, cvId, certification, dateIssued, description];
        pool.query(sql, values, (error, result) => {
            if (error) {
                console.error('Error adding certificate:', error);
                return res.status(500).json({ error: 'An error occurred while adding the certificate.' });
            }
            res.status(200).json({ message: 'Certificate added successfully' });
        });
    } catch (error) {
        console.error('Error adding certificate:', error);
        res.status(500).json({ error: 'An error occurred while adding the certificate.' });
    }
});

// Route to add education
cvRoutes.post('/addEducation', async (req, res) => {
    try {
        const pool = req.pool;
        const { cvId, level, fieldOfStudy, school, TimePeriod} = req.body;
        const candidateId = await getCandidateIdFromToken(pool, req);
        if (!candidateId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const sql = 'INSERT INTO education (CandidateID, CV_ID, Level, FieldOfStudy, School, TimePeriod) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [candidateId, cvId, level, fieldOfStudy, school, TimePeriod];
        pool.query(sql, values, (error, result) => {
            if (error) {
                console.error('Error adding education:', error);
                return res.status(500).json({ error: 'An error occurred while adding the education.' });
            }
            res.status(200).json({ message: 'Education added successfully' });
        });
    } catch (error) {
        console.error('Error adding education:', error);
        res.status(500).json({ error: 'An error occurred while adding the education.' });
    }
});

// Route to add work experience
cvRoutes.post('/addWorkExperience', async (req, res) => {
    try {
        const pool = req.pool;
        const { cvId, jobTitle, company, TimePeriod, description } = req.body;
        const candidateId = await getCandidateIdFromToken(pool, req);
        if (!candidateId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const sql = 'INSERT INTO work_experience (CandidateID, CV_ID, JobTitle, Company, TimePeriod, Description) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [candidateId, cvId, jobTitle, company, TimePeriod, description];
        pool.query(sql, values, (error, result) => {
            if (error) {
                console.error('Error adding work experience:', error);
                return res.status(500).json({ error: 'An error occurred while adding the work experience.' });
            }
            res.status(200).json({ message: 'Work experience added successfully' });
        });
    } catch (error) {
        console.error('Error adding work experience:', error);
        res.status(500).json({ error: 'An error occurred while adding the work experience.' });
    }
});

// Route to fetch CV data
cvRoutes.get('/getCV', async (req, res) => {
    try {
        const pool = req.pool;
        const candidateId = await getCandidateIdFromToken(pool, req);
        if (!candidateId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const sql = 'SELECT Summary, Skills, SoftSkills, Searchable FROM cv WHERE CandidateID = ?';
        pool.query(sql, [candidateId], (error, rows) => {
            if (error) {
                console.error('Error fetching CV data:', error);
                return res.status(500).json({ error: 'An error occurred while fetching CV data.' });
            }
            if (rows.length > 0) {
                res.status(200).json(rows[0]);
            } else {
                res.status(404).json({ message: 'CV data not found' });
            }
        });
    } catch (error) {
        console.error('Error fetching CV data:', error);
        res.status(500).json({ error: 'An error occurred while fetching CV data.' });
    }
});

// Route to fetch existing education data
cvRoutes.get('/getEducation', async (req, res) => {
    try {
        const pool = req.pool;
        const candidateId = await getCandidateIdFromToken(pool, req);
        if (!candidateId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const sql = 'SELECT * FROM education WHERE CandidateID = ?';
        pool.query(sql, [candidateId], (error, rows) => {
            if (error) {
                console.error('Error fetching education data:', error);
                return res.status(500).json({ error: 'An error occurred while fetching education data.' });
            }
            if (rows.length > 0) {
                res.status(200).json(rows);
            } else {
                res.status(404).json({ message: 'Education data not found' });
            }
        });
    } catch (error) {
        console.error('Error fetching education data:', error);
        res.status(500).json({ error: 'An error occurred while fetching education data.' });
    }
});

// Route to fetch existing work experience data
cvRoutes.get('/getWorkExperience', async (req, res) => {
    try {
        const pool = req.pool;
        const candidateId = await getCandidateIdFromToken(pool, req);
        if (!candidateId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const sql = 'SELECT * FROM work_experience WHERE CandidateID = ?';
        pool.query(sql, [candidateId], (error, rows) => {
            if (error) {
                console.error('Error fetching work experience data:', error);
                return res.status(500).json({ error: 'An error occurred while fetching work experience data.' });
            }
            if (rows.length > 0) {
                res.status(200).json(rows);
            } else {
                res.status(404).json({ message: 'Work experience data not found' });
            }
        });
    } catch (error) {
        console.error('Error fetching work experience data:', error);
        res.status(500).json({ error: 'An error occurred while fetching work experience data.' });
    }
});

// Route to fetch existing certificate data
cvRoutes.get('/getCertificate', async (req, res) => {
    try {
        const pool = req.pool;
        const candidateId = await getCandidateIdFromToken(pool, req);
        if (!candidateId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const sql = 'SELECT * FROM certification WHERE CandidateID = ?';
        pool.query(sql, [candidateId], (error, rows) => {
            if (error) {
                console.error('Error fetching certificate data:', error);
                return res.status(500).json({ error: 'An error occurred while fetching certificate data.' });
            }
            if (rows.length > 0) {
                res.status(200).json(rows);
            } else {
                res.status(404).json({ message: 'Certificate data not found' });
            }
        });
    } catch (error) {
        console.error('Error fetching certificate data:', error);
        res.status(500).json({ error: 'An error occurred while fetching certificate data.' });
    }
});

// Route to delete education data
cvRoutes.delete('/deleteEducation', async (req, res) => {
    try {
        const pool = req.pool;
        const candidateId = await getCandidateIdFromToken(pool, req);
        if (!candidateId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const deleteSql = 'DELETE FROM education WHERE CandidateID = ?';
        pool.query(deleteSql, [candidateId], (error, result) => {
            if (error) {
                console.error('Error deleting education data:', error);
                return res.status(500).json({ error: 'An error occurred while deleting education data.' });
            }
            res.status(200).json({ message: 'Education data deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting education data:', error);
        res.status(500).json({ error: 'An error occurred while deleting education data.' });
    }
});

// Route to delete work experience data
cvRoutes.delete('/deleteWorkExperience', async (req, res) => {
    try {
        const pool = req.pool;
        const candidateId = await getCandidateIdFromToken(pool, req);
        if (!candidateId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const deleteSql = 'DELETE FROM work_experience WHERE CandidateID = ?';
        pool.query(deleteSql, [candidateId], (error, result) => {
            if (error) {
                console.error('Error deleting work experience data:', error);
                return res.status(500).json({ error: 'An error occurred while deleting work experience data.' });
            }
            res.status(200).json({ message: 'Work experience data deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting work experience data:', error);
        res.status(500).json({ error: 'An error occurred while deleting work experience data.' });
    }
});

// Route to delete certificate data
cvRoutes.delete('/deleteCertificate', async (req, res) => {
    try {
        const pool = req.pool;
        const candidateId = await getCandidateIdFromToken(pool, req);
        if (!candidateId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const deleteSql = 'DELETE FROM certification WHERE CandidateID = ?';
        pool.query(deleteSql, [candidateId], (error, result) => {
            if (error) {
                console.error('Error deleting certificate data:', error);
                return res.status(500).json({ error: 'An error occurred while deleting certificate data.' });
            }
            res.status(200).json({ message: 'Certificate data deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting certificate data:', error);
        res.status(500).json({ error: 'An error occurred while deleting certificate data.' });
    }
});

module.exports = cvRoutes;
