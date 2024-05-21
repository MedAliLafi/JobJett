const express = require('express');
const userRoutes = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'jobjett@hotmail.com',
        pass: 'job7050jett'
    }
  });

function generateVerificationCode() {
    return Math.floor(10000000 + Math.random() * 90000000);
}

// Function to register a new user
function registerUser(pool, email, password, userType, callback) {
    // Inserting user details into User table
    const sql = 'INSERT INTO User (Email, Password, UserType) VALUES (?, ?, ?)';
    const values = [email, password, userType];

    pool.query(sql, values, (error, result) => {
        if (error) {
            console.error('Error registering user: ' + error);
            return callback(error);
        }
        console.log('User registered successfully with ID: ' + result.insertId);
        callback(null, result);
    });
}

function loginUser(pool, email, password, callback) {
    // Query the database to find the user with the provided email
    const query = 'SELECT * FROM User WHERE Email = ?';
    pool.query(query, [email], async (error, results) => {
        if (error) {
            console.error('Error querying user:', error);
            return callback(error, null);
        }

        if (results.length === 0) {
            // User with the provided email does not exist
            return callback(null, { error: 'User not found.' });
        }

        // Compare the provided password with the hashed password stored in the database
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.Password);
        if (!passwordMatch) {
            // Passwords do not match
            return callback(null, { error: 'Invalid password.' });
        }

        // If passwords match, return the user details
        callback(null, { message: 'Login successful', user });
    });
}

// Route to change password
userRoutes.post('/changePassword', async (req, res) => {
    const pool = req.pool;
    const { newPassword } = req.body;

    try {
        const token = req.cookies.token;
        if (!token) return null;
        const decoded = jwt.verify(token, 'secret_key');
        const userId = decoded.user.UserID;
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
                transporter.sendMail({
                    from: 'jobjett@hotmail.com',
                    to: user.Email,
                    subject: 'Your Password has been changed',
                    text: 'Your Password has been changed successfully!'
                }, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });
                res.status(200).json({ message: 'Password changed successfully' });
            });
        });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ error: 'An error occurred while changing password.' });
    }
});

userRoutes.post('/verificationPassword', async (req, res) => {
    const pool = req.pool;
    const { currentPassword } = req.body;

    try {
        const token = req.cookies.token;
        if (!token) return null;
        const decoded = jwt.verify(token, 'secret_key');
        const userId = decoded.user.UserID;
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

            const verificationCode = generateVerificationCode();
            transporter.sendMail({
                from: 'jobjett@hotmail.com',
                to: user.Email,
                subject: 'Request to change password',
                text: `Your verification code is: ${verificationCode}`
            }, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ error: 'An error occurred while sending verification code email.' });
                } else {
                    console.log('Email sent:', info.response);
                    return res.status(200).json({ code: verificationCode });
                }
            });
        });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ error: 'An error occurred while changing password.' });
    }
});

// In your user.js file where you define routes
userRoutes.post('/changeEmail', async (req, res) => {
    const pool = req.pool;
    const { newEmail } = req.body;

    try {
        const token = req.cookies.token;
        if (!token) return null;
        const decoded = jwt.verify(token, 'secret_key');
        const userId = decoded.user.UserID;
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
    } catch (error) {
        console.error('Error changing email:', error);
        return res.status(500).json({ error: 'An error occurred while changing email.' });
    }
});

userRoutes.post('/verificationEmail', async (req, res) => {
    const pool = req.pool;
    const { password } = req.body;

    try {
        const token = req.cookies.token;
        if (!token) return null;
        const decoded = jwt.verify(token, 'secret_key');
        const userId = decoded.user.UserID;
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
            const passwordMatch = await bcrypt.compare(password, user.Password);
            if (!passwordMatch) {
                // Password is incorrect
                return res.status(401).json({ error: 'Incorrect  password.' });
            }

            const verificationCode = generateVerificationCode();
            transporter.sendMail({
                from: 'jobjett@hotmail.com',
                to: user.Email,
                subject: 'Request to change email',
                text: `Your verification code is: ${verificationCode}`
            }, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ error: 'An error occurred while sending verification code email.' });
                } else {
                    console.log('Email sent:', info.response);
                    return res.status(200).json({ code: verificationCode }); // Send the verification code to the client
                }
            });
            return res.status(200).json({ code: verificationCode }); // Send the verification code to the client
        });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ error: 'An error occurred while changing password.' });
    }
});

// Route to delete user
userRoutes.delete('/deleteUser', async (req, res) => {
    const pool = req.pool;
    try {
        const token = req.cookies.token;
        if (!token) return null;
        const decoded = jwt.verify(token, 'secret_key');
        const userId = decoded.user.UserID;
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
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ error: 'An error occurred while deleting user.' });
    }
});

userRoutes.get('/notifications', async (req, res) => {
    const pool = req.pool;
    try {
        const token = req.cookies.token;
        if (!token) return null;
        const decoded = jwt.verify(token, 'secret_key');
        const userId = decoded.user.UserID;
        const query = 'SELECT * FROM Notification WHERE UserID = ? ORDER BY DateTime DESC';
        pool.query(query, [userId], (error, results) => {
            if (error) {
                console.error('Error fetching notifications:', error);
                return res.status(500).json({ error: 'An error occurred while fetching notifications.' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ error: 'An error occurred while fetching notifications.' });
    }
});

userRoutes.delete('/deleteNotification/:notificationId', async (req, res) => {
    const pool = req.pool;
    const { notificationId } = req.params;
    try {
        const deleteQuery = 'DELETE FROM Notification WHERE NotificationID = ?';
        pool.query(deleteQuery, [notificationId], (error, result) => {
            if (error) {
                console.error('Error deleting notification:', error);
                return res.status(500).json({ error: 'An error occurred while deleting notification.' });
            }
            console.log('Notification deleted successfully');
            res.status(200).json({ message: 'Notification deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        return res.status(500).json({ error: 'An error occurred while deleting notification.' });
    }
});

userRoutes.put('/markAsRead/:notificationId', async (req, res) => {
    const pool = req.pool;
    const { notificationId } = req.params;
    try {
        const updateQuery = 'UPDATE Notification SET `Read` = 1 WHERE NotificationID = ?';
        pool.query(updateQuery, [notificationId], (error, result) => {
            if (error) {
                console.error('Error marking notification as read:', error);
                return res.status(500).json({ error: 'An error occurred while marking notification as read.' });
            }
            console.log('Notification marked as read successfully');
            res.status(200).json({ message: 'Notification marked as read successfully' });
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return res.status(500).json({ error: 'An error occurred while marking notification as read.' });
    }
});

userRoutes.post('/verifyRegistration', async (req, res) => {
    const { email } = req.body;
    try {
        const verificationCode = generateVerificationCode();
        console.log(email);
        transporter.sendMail({
            from: 'jobjett@hotmail.com',
            to: email,
            subject: 'Registration verification',
            text: `Your verification code is: ${verificationCode}`
        }, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'An error occurred while sending verification code email.' });
            } else {
                console.log('Email sent:', info.response);
                return res.status(200).json({ code: verificationCode });
            }
        });
        return res.status(200).json({ code: verificationCode });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ error: 'An error occurred while changing password.' });
    }
});

module.exports = { userRoutes, registerUser , loginUser};
