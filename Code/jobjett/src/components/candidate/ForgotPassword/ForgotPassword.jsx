import React, { useState } from 'react';
import Navbar from "../../NavBar/Navbar.jsx";
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [verifyNewPassword, setVerifyNewPassword] = useState('');
    const [Code, setCode] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationCodeSent, setVerificationCodeSent] = useState(false);

    const handleSendVerificationCode = async () => {
        try {
            const response = await fetch('http://localhost:9000/Candidate/forgotpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email }),
            });
            if (response.ok) {
                const data = await response.json();
                setVerificationCode(data.code);
                setVerificationCodeSent(true);
            } else {
                console.error('Failed to send verification code');
            }
        } catch (error) {
            console.error('Error sending verification code:', error);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== verifyNewPassword) {
            console.error('New passwords do not match');
            return;
        }
        if (Code !== verificationCode) {
            console.error('Incorrect verification code');
            return;
        }
        try {
            const response = await fetch('http://localhost:9000/Candidate/changepass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, newPassword }),
            });
            if (response.ok) {
                console.log('Password changed successfully');
                navigate('/candidate/login');
            } else {
                console.error('Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-md mx-auto mt-8">
                <h2 className="text-2xl font-semibold mb-4 text-blueColor">Forgot Password</h2>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueColor focus:ring focus:ring-blueColor focus:ring-opacity-50" />
                    </div>
                    <button onClick={handleSendVerificationCode} className="w-full mb-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blueColor hover:bg-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blueColor">
                        Send Verification Code
                    </button>
                    {verificationCodeSent && (
                        <div className="mb-4">
                            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">Verification Code:</label>
                            <input type="text" id="verificationCode" value={Code} onChange={e => setCode(parseInt(e.target.value))} className="mt-1 mb-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueColor focus:ring focus:ring-blueColor focus:ring-opacity-50" />         
                            <div className="mb-4">
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password:</label>
                                <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueColor focus:ring focus:ring-blueColor focus:ring-opacity-50" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="verifyNewPassword" className="block text-sm font-medium text-gray-700">Verify New Password:</label>
                                <input type="password" id="verifyNewPassword" value={verifyNewPassword} onChange={e => setVerifyNewPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueColor focus:ring focus:ring-blueColor focus:ring-opacity-50" />
                            </div>
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

export default ForgotPassword;
