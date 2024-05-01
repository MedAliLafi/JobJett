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
        <Navbar></Navbar>
        <div>
            <h2>Change Email</h2>
            <div>
                <label htmlFor="newEmail">New Email:</label>
                <input type="email" id="newEmail" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button onClick={handleChangeEmail}>Change Email</button>
        </div>
        </>
    );
};

export default ChangeEmail;
