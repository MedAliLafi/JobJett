import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../NavBar/Navbar.jsx";

const EmployerProfile = () => {
    const navigate = useNavigate();
    const [employerInfo, setEmployerInfo] = useState(null);

    useEffect(() => {
        fetchEmployerInfo();
    }, []);

    const fetchEmployerInfo = async () => {
        try {
            const response = await fetch('http://localhost:9000/Employer/employerInfo', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setEmployerInfo(data);
            } else {
                console.error('Failed to fetch employer information');
            }
        } catch (error) {
            console.error('Error fetching employer information:', error);
        }
    };

    const handleViewApplications = () => {
        navigate('/employer/applications');
    };

    const handleAddJobOffer = () => {
        navigate('/employer/addjoboffer');
    };

    const handleChangePassword = () => {
    };

    const handleChangeEmail = () => {
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch('http://localhost:9000/User/deleteUser', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (response.ok) {
                logout();
                navigate('/employer/login');
            } else {
                console.error('Account deletion failed');
            }
        } catch (error) {
            console.error('Error during account deletion:', error);
        }
    };

    const logout = async () => {
        try {
            const response = await fetch('http://localhost:9000/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                console.error('Logout failed');
            }
            navigate('/employer/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <>
        <Navbar></Navbar>
        <div>
            <h2>Employer Profile</h2>
            {employerInfo && (
                <div>
                <p><strong>Company Name:</strong> {employerInfo.companyName}</p>
                <p><strong>Email:</strong> {employerInfo.email}</p>
                <p><strong>Industry:</strong> {employerInfo.industry}</p>
                <p><strong>Phone:</strong> {employerInfo.phone}</p>
                <p><strong>Address:</strong> {employerInfo.address}</p>
                <p><strong>State:</strong> {employerInfo.state}</p>
                <p><strong>Country:</strong> {employerInfo.country}</p>
                </div>
            )}
            <h3>Actions</h3>
            <button onClick={handleViewApplications}>View Applications</button>
            <button onClick={handleAddJobOffer}>Add Job Offer</button>
            <button onClick={handleChangePassword}>Change Password</button>
            <button onClick={handleChangeEmail}>Change Email</button>
            <button onClick={handleDeleteAccount}>Delete Account</button>
            <button onClick={logout}>Logout</button>
        </div>
        </>
    );
};

export default EmployerProfile;
