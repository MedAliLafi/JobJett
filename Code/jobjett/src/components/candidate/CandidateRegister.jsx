import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const CandidateRegister = () => {
    const navigate = useNavigate();

    const checkLoggedIn = async () => {
        try {
            const response = await fetch('http://localhost:9000/Candidate/loginCandidate/checkCandidateAuth', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.loggedIn) {
                    navigate("/candidate/profile");
                }
            } else {
                console.error('Failed to check if candidate is logged in');
            }
        } catch (error) {
            console.error('Error checking if candidate is logged in:', error);
        }
    };

    useEffect(() => {
        checkLoggedIn();
    }, []);

    const registerCandidate = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        try {
            const response = await fetch('http://localhost:9000/Candidate/registerCandidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: formData.get('username'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    dateOfBirth: formData.get('dateOfBirth'),
                    phone: formData.get('phone'),
                    address: formData.get('address'),
                    state: formData.get('state'),
                    country: formData.get('country')
                })
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            console.log('Registration successful');
            const loginResponse = await fetch('http://localhost:9000/Candidate/loginCandidate', {
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
            navigate("/candidate/profile");
        } catch (error) {
            console.error('Error registering candidate:', error);
        }
    };

    return (
        <div>
            <h2>Candidate Registration</h2>
            <form onSubmit={registerCandidate} id="candidateRegistrationForm">
                <label htmlFor="username">Username:</label><br />
                <input type="text" id="username" name="username" required /><br />
                <label htmlFor="email">Email:</label><br />
                <input type="email" id="email" name="email" required /><br />
                <label htmlFor="password">Password:</label><br />
                <input type="password" id="password" name="password" required /><br />
                <label htmlFor="firstName">First Name:</label><br />
                <input type="text" id="firstName" name="firstName" required /><br />
                <label htmlFor="lastName">Last Name:</label><br />
                <input type="text" id="lastName" name="lastName" required /><br />
                <label htmlFor="dateOfBirth">Date of Birth:</label><br />
                <input type="date" id="dateOfBirth" name="dateOfBirth" required /><br />
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
            <p>Already Registered? <Link to="/candidate/login">Login here</Link></p>
        </div>
    );
};

export default CandidateRegister;