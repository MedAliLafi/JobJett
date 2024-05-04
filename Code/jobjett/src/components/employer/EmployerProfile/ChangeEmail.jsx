import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../NavBar/EmployerNavbar.jsx";

const ChangeEmail = () => {
    const navigate = useNavigate();
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleChangeEmail = async () => {
        try {
            const response = await fetch('http://localhost:9000/User/changeEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newEmail, password }),
                credentials: 'include'
            });
            if (response.ok) {
                navigate('/employer/profile'); // Redirect to profile page
            } else {
                console.error('Failed to change email');
            }
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
                    <button onClick={handleChangeEmail} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blueColor hover:bg-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blueColor">
                        Change Email
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChangeEmail;
