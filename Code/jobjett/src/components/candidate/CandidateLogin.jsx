import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from "../NavBar/Navbar.jsx";
import logo from "../../assets/output-onlinetools.png";
import "./CandidateLogin.css";

const CandidateLogin = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState(1);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
                    setIsLoggedIn(true);
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

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/candidate/profile");
        }
    }, [isLoggedIn, navigate]);

    const loginCandidate = async (event) => {
        event.preventDefault();
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

            if (response.ok) {
                setIsLoggedIn(true);
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Error logging in candidate:', error);
        }
    };
    const nextButtonFunction = () => {
        setActive((prevActive) => Math.min(prevActive + 1, 3));
      };
    
      const prevButtonFunction = () => {
        setActive((prevActive) => Math.max(prevActive - 1, 1));
      };
    return (
        <>
            <Navbar></Navbar>
            <div id="page" className="site flex flex-row min-h-screen justify-center items-center">
                <div className="container flex flex-row min-h-screen justify-center items-center ">
                    <div className="form-box ">
                        <div className="progress">
                            <div className="logo">
                                <img src={logo} alt="Logo"></img>
                            </div>
                        </div>
                        <form onSubmit={loginCandidate}>
                            <div className={`form-one form-step ${active === 1 ? "active" : ""}`}>
                                <div className="bg-svg"></div>
                                <h2>Candidate Login</h2>
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
                            </div>
                            <div className="btn-group flex justify-between">
                                <button type="submit" className="btn-submit">
                                    Login
                                </button>
                                <br></br><p>Don't have an account? <Link to="/candidate/register">Register here</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CandidateLogin;