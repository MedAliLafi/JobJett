import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../NavBar/EmployerNavbar.jsx";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [verifyNewPassword, setVerifyNewPassword] = useState('');
    const [Code, setCode] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationCodeSent, setVerificationCodeSent] = useState(false);

    const handleVerificationCode = async () => {
        if (newPassword !== verifyNewPassword) {
            console.error('New passwords do not match');
            return;
        }
        try {
            const response = await fetch('http://localhost:9000/User/verificationPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ currentPassword }),
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setVerificationCode(parseInt(data.code));
                setVerificationCodeSent(true);
            } else {
                const errorData = await response.json();
                console.error(errorData);
                alert(`${errorData.error}`);
            }
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    const handleChangePassword = async () => {
        if (Code !== verificationCode) {
            alert('Incorrect verification code');
            return;
        }
    
        if (!newPassword || newPassword.trim().length < 8) {
            alert('New password must be at least 8 characters long');
            return;
        }
    
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            alert('New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)');
            return;
        }
    
        if (newPassword !== verifyNewPassword) {
            alert('New passwords do not match');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:9000/User/changePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newPassword }),
                credentials: 'include'
            });
            if (response.ok) {
                navigate('/employer/profile');
            } else {
                const errorData = await response.json();
                console.error(errorData);
                alert(`${errorData.error}`);            }
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };
    

    return (
        <>
            <Navbar />
            <div className="max-w-md mx-auto mt-8">
                <h2 className="text-2xl font-semibold mb-4 text-blueColor">Change Password</h2>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="mb-4">
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password:</label>
                        <input type="password" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueColor focus:ring focus:ring-blueColor focus:ring-opacity-50" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password:</label>
                        <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueColor focus:ring focus:ring-blueColor focus:ring-opacity-50" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="verifyNewPassword" className="block text-sm font-medium text-gray-700">Verify New Password:</label>
                        <input type="password" id="verifyNewPassword" value={verifyNewPassword} onChange={e => setVerifyNewPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueColor focus:ring focus:ring-blueColor focus:ring-opacity-50" />
                    </div>
                    <button onClick={handleVerificationCode} className="w-full mb-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blueColor hover:bg-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blueColor">
                        Send Verification Code
                    </button>
                    {verificationCodeSent && (
                    <div className="mb-4">
                        <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">Verification Code:</label>
                        <input type="text" id="verificationCode" value={Code} onChange={e => setCode(parseInt(e.target.value))} className="mt-1 mb-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueColor focus:ring focus:ring-blueColor focus:ring-opacity-50" />         
                        <button onClick={handleChangePassword} className="w-full mb-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blueColor hover:bg-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blueColor">
                        Change Password
                        </button>
                    </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ChangePassword;
