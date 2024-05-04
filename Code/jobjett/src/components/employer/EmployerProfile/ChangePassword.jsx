import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../NavBar/EmployerNavbar.jsx";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [verifyNewPassword, setVerifyNewPassword] = useState('');

    const handleChangePassword = async () => {
        if (newPassword !== verifyNewPassword) {
            console.error('New passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost:9000/User/changePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ currentPassword, newPassword }),
                credentials: 'include'
            });
            if (response.ok) {
                navigate('/employer/profile'); // Redirect to profile page
            } else {
                console.error('Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    return (
        <>
        <Navbar></Navbar>
        <div>
            <h2>Change Password</h2>
            <div>
                <label htmlFor="currentPassword">Current Password:</label>
                <input type="password" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            </div>
            <div>
                <label htmlFor="newPassword">New Password:</label>
                <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div>
                <label htmlFor="verifyNewPassword">Verify New Password:</label>
                <input type="password" id="verifyNewPassword" value={verifyNewPassword} onChange={e => setVerifyNewPassword(e.target.value)} />
            </div>
            <button onClick={handleChangePassword}>Change Password</button>
        </div>
        </>
    );
};

export default ChangePassword;
