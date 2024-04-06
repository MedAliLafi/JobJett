import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const EmployerLogin = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkLoggedIn = async () => {
        try {
            const response = await fetch('http://localhost:9000/Employer/loginEmployer/checkEmployerAuth', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.loggedIn) {
                    setIsLoggedIn(true);
                }
            } else {
                console.error('Failed to check if employer is logged in');
            }
        } catch (error) {
            console.error('Error checking if employer is logged in:', error);
        }
    };

    useEffect(() => {
        checkLoggedIn();
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/employer/profile");
        }
    }, [isLoggedIn, navigate]);

    const loginEmployer = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        try {
            const response = await fetch('http://localhost:9000/Employer/loginEmployer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.get('email'),
                    password: formData.get('password')
                }),
                credentials: 'include'
            });

            if (response.ok) {
                setIsLoggedIn(true);
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Error logging in employer:', error);
        }
    };

    return (
        <div>
            <h2>Employer Login</h2>
            <form onSubmit={loginEmployer}>
                <label htmlFor="email">Email:</label><br />
                <input type="email" id="email" name="email" required /><br /><br />
                <label htmlFor="password">Password:</label><br />
                <input type="password" id="password" name="password" required /><br /><br />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/employer/register">Register here</Link></p>
        </div>
    );
};

export default EmployerLogin;
