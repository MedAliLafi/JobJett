import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../NavBar/CandidateNavbar.jsx";

const ChangeEmail = () => {
    const navigate = useNavigate();
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [Code, setCode] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationCodeSent, setVerificationCodeSent] = useState(false);

    const handleVerificationCode = async () => {
        try {
            const response = await fetch('http://localhost:9000/User/verificationEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password }),
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setVerificationCode(parseInt(data.code));
                setVerificationCodeSent(true);
            } else {
                const errorData = await response.json();
                console.error(errorData);
                alert(`${errorData.error}`);            }
        } catch (error) {
            console.error('Error changing email:', error);
        }
    };

    const handleChangeEmail = async () => {
        if (Code !== verificationCode) {
            console.error('Incorrect verification code');
            return;
        }
        try {
            const response = await fetch('http://localhost:9000/User/changeEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newEmail }),
                credentials: 'include'
            });
            if (response.ok) {
                navigate('/candidate/profile'); // Redirect to profile page
            } else {
                const errorData = await response.json();
                console.error(errorData);
                alert(`${errorData.error}`);            }
        } catch (error) {
            console.error('Error changing email:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-md mx-auto mt-8">
                <h2 className="text-2xl font-semibold mb-4 text-blueColor">Change Email</h2>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="mb-4">
                        <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700">New Email:</label>
                        <input type="email" id="newEmail" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueColor focus:ring focus:ring-blueColor focus:ring-opacity-50" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueColor focus:ring focus:ring-blueColor focus:ring-opacity-50" />
                    </div>
                    <button onClick={handleVerificationCode} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blueColor hover:bg-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blueColor">
                    Send Verification Code
                    </button>
                    {verificationCodeSent && (
                    <div className="mb-4">
                        <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">Verification Code:</label>
                        <input type="text" id="verificationCode" value={Code} onChange={e => setCode(parseInt(e.target.value))} className="mt-1 mb-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blueColor focus:ring focus:ring-blueColor focus:ring-opacity-50" />         
                        <button onClick={handleChangeEmail} className="w-full mb-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blueColor hover:bg-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blueColor">
                        Change Email
                        </button>
                    </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ChangeEmail;
