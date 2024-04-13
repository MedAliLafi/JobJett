import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from "../NavBar/Navbar.jsx";
import logo from "../../assets/output-onlinetools.png";
import "./EmployerLogin.css"

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
                navigate("/employer/profile");
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Error logging in employer:', error);
        }
    };

    return (
        <>
            <Navbar></Navbar>
            <div id="page" className="site">
                <div className="container">
                    <div className="loginform">
                        <div className="progress">
                            <div className="logo">
                                <img src={logo} alt="Logo"></img>
                            </div>
                        </div>
                        <form onSubmit={loginEmployer}>
                            <div className="bg-svg"></div>
                            <h2>Employer Login</h2>
                            <div>
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    id="email" name="email"
                                    required
                                ></input>
                            </div>
                            <div>
                                <label>Password</label>
                                <input type="password" placeholder="Password" id="password" name="password" required></input>
                            </div>
                            <div className="btn-container">
                                <button type="submit" className="btn-submit">Login</button>
                            </div>
                            <p>Don't have an account? <Link to="/employer/register">Register here</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmployerLogin;
