const express = require('express');
const userRoutes = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to register a new user
function registerUser(pool, username, email, password, userType, callback) {
    // Inserting user details into User table
    const sql = 'INSERT INTO User (Username, Email, Password, UserType) VALUES (?, ?, ?, ?)';
    const values = [username, email, password, userType];

    pool.query(sql, values, (error, result) => {
        if (error) {
            console.error('Error registering user: ' + error);
            return callback(error);
        }
        console.log('User registered successfully with ID: ' + result.insertId);
        callback(null, result);
    });
}

// Route to login
userRoutes.post('/login', async (req, res) => {
    const pool = req.pool;
    const { email, password } = req.body;

    try {
        // Query the database to find the user with the provided email
        const query = 'SELECT * FROM User WHERE Email = ?';
        pool.query(query, [email], async (error, results) => {
            if (error) {
                console.error('Error querying user:', error);
                return res.status(500).json({ error: 'An error occurred while logging in.' });
            }

            if (results.length === 0) {
                // User with the provided email does not exist
                return res.status(404).json({ error: 'User not found.' });
            }

            // Compare the provided password with the hashed password stored in the database
            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.Password);
            if (!passwordMatch) {
                // Passwords do not match
                return res.status(401).json({ error: 'Invalid password.' });
            }

            // If passwords match, generate a JWT token
            const token = jwt.sign({ userId: user.UserID, userType: user.UserType }, 'secret_key');
            res.status(200).json({ message: 'Login successful', token: token });


        });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ error: 'An error occurred while logging in.' });
    }
});

// Route to change password
userRoutes.post('/changePassword', async (req, res) => {
    const pool = req.pool;
    const { userId, currentPassword, newPassword } = req.body;

    try {
        // Check if the current password matches the one in the database
        const query = 'SELECT * FROM User WHERE UserID = ?';
        pool.query(query, [userId], async (error, results) => {
            if (error) {
                console.error('Error querying user:', error);
                return res.status(500).json({ error: 'An error occurred while changing password.' });
            }

            if (results.length === 0) {
                // User not found
                return res.status(404).json({ error: 'User not found.' });
            }

            const user = results[0];
            const passwordMatch = await bcrypt.compare(currentPassword, user.Password);
            if (!passwordMatch) {
                // Current password is incorrect
                return res.status(401).json({ error: 'Incorrect current password.' });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password in the database
            const updateQuery = 'UPDATE User SET Password = ? WHERE UserID = ?';
            pool.query(updateQuery, [hashedPassword, userId], (error, result) => {
                if (error) {
                    console.error('Error updating password:', error);
                    return res.status(500).json({ error: 'An error occurred while changing password.' });
                }
                console.log('Password changed successfully');
                res.status(200).json({ message: 'Password changed successfully' });
            });
        });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ error: 'An error occurred while changing password.' });
    }
});

// Route to change email
userRoutes.post('/changeEmail', async (req, res) => {
    const pool = req.pool;
    const { userId, newEmail } = req.body;

    try {
        // Check if the user exists
        const query = 'SELECT * FROM User WHERE UserID = ?';
        pool.query(query, [userId], async (error, results) => {
            if (error) {
                console.error('Error querying user:', error);
                return res.status(500).json({ error: 'An error occurred while changing email.' });
            }

            if (results.length === 0) {
                // User not found
                return res.status(404).json({ error: 'User not found.' });
            }

            // Update the user's email in the database
            const updateQuery = 'UPDATE User SET Email = ? WHERE UserID = ?';
            pool.query(updateQuery, [newEmail, userId], (error, result) => {
                if (error) {
                    console.error('Error updating email:', error);
                    return res.status(500).json({ error: 'An error occurred while changing email.' });
                }
                console.log('Email changed successfully');
                res.status(200).json({ message: 'Email changed successfully' });
            });
        });
    } catch (error) {
        console.error('Error changing email:', error);
        return res.status(500).json({ error: 'An error occurred while changing email.' });
    }
});

// Route to delete user
userRoutes.delete('/deleteUser', async (req, res) => {
    const pool = req.pool;
    const { userId } = req.body;

    try {
        // Check if the user exists
        const query = 'SELECT * FROM User WHERE UserID = ?';
        pool.query(query, [userId], async (error, results) => {
            if (error) {
                console.error('Error querying user:', error);
                return res.status(500).json({ error: 'An error occurred while deleting user.' });
            }

            if (results.length === 0) {
                // User not found
                return res.status(404).json({ error: 'User not found.' });
            }

            // Delete the user from the database
            const deleteQuery = 'DELETE FROM User WHERE UserID = ?';
            pool.query(deleteQuery, [userId], (error, result) => {
                if (error) {
                    console.error('Error deleting user:', error);
                    return res.status(500).json({ error: 'An error occurred while deleting user.' });
                }
                console.log('User deleted successfully');
                res.status(200).json({ message: 'User deleted successfully' });
            });
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ error: 'An error occurred while deleting user.' });
    }
});

module.exports = { userRoutes, registerUser };
