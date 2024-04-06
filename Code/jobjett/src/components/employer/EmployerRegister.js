import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const EmployerRegister = () => {
    const navigate = useNavigate();

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
                    navigate("/employer/profile");
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

    const registerEmployer = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        try {
            const response = await fetch('http://localhost:9000/Employer/registerEmployer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: formData.get('username'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    companyName: formData.get('companyName'),
                    industry: formData.get('industry'),
                    phone: formData.get('phone'),
                    state: formData.get('state'),
                    country: formData.get('country'),
                    address: formData.get('address')
                })
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            console.log('Registration successful');
            const loginResponse = await fetch('http://localhost:9000/Employer/loginEmployer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: formData.get('email'),
                    password: formData.get('password')
                })
            });

            if (!loginResponse.ok) {
                throw new Error('Login failed');
            }

            console.log('Login successful');
            navigate("/employer/profile");
        } catch (error) {
            console.error('Error registering employer:', error);
        }
    };

    return (
        <div>
            <h2>Employer Registration</h2>
            <form onSubmit={registerEmployer} id="employerRegistrationForm">
                <label htmlFor="username">Username:</label><br />
                <input type="text" id="username" name="username" required /><br />
                <label htmlFor="email">Email:</label><br />
                <input type="email" id="email" name="email" required /><br />
                <label htmlFor="password">Password:</label><br />
                <input type="password" id="password" name="password" required /><br />
                <label htmlFor="companyName">Company Name:</label><br />
                <input type="text" id="companyName" name="companyName" required /><br />
                <label htmlFor="industry">Industry:</label><br />
                <input type="text" id="industry" name="industry" required /><br />
                <label htmlFor="phone">Phone:</label><br />
                <input type="text" id="phone" name="phone" /><br />
                <label htmlFor="state">State:</label><br />
                <input type="text" id="state" name="state" /><br />
                <label htmlFor="country">Country:</label><br />
                <input type="text" id="country" name="country" /><br />
                <label htmlFor="address">Address:</label><br />
                <input type="text" id="address" name="address" /><br />
                <button type="submit">Register</button>
            </form>
            <p>Already Registered? <Link to="/employer/login">Login here</Link></p>
        </div>
    );
};

export default EmployerRegister;