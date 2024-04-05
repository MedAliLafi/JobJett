import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const CandidateLogin = () => {
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
                    // Redirect to profile page if candidate is already logged in
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
        checkLoggedIn(); // Call checkLoggedIn function when the component mounts
    }, []);

    const loginCandidate = async (event) => {
        event.preventDefault(); // Prevent form submission
        const formData = new FormData(event.target);
        try {
            const response = await fetch('http://localhost:9000/Candidate/loginCandidate', {
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

            if (!response.ok) {
                throw new Error('Login failed');
            }
            const data = await response.json();
            console.log('Login successful:', data);
            setTimeout(() => {
                navigate("/candidate/profile");
            }, 1000);
        } catch (error) {
            console.error('Error logging in candidate:', error);
        }
    };

    return (
        <div>
            <h2>Candidate Login</h2>
            <form onSubmit={loginCandidate}>
                <label htmlFor="email">Email:</label><br />
                <input type="email" id="email" name="email" required /><br /><br />
                <label htmlFor="password">Password:</label><br />
                <input type="password" id="password" name="password" required /><br /><br />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/candidate/register">Register here</Link></p>
        </div>
    );
};

export default CandidateLogin;
