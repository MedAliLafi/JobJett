import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CandidateProfile = () => {
    const navigate = useNavigate();
    const [candidateInfo, setCandidateInfo] = useState(null);

    useEffect(() => {
        fetchCandidateInfo();
    }, []);

    const fetchCandidateInfo = async () => {
        try {
            const response = await fetch('http://localhost:9000/Candidate/candidateInfo', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                data.dateOfBirth = new Date(data.dateOfBirth).toLocaleDateString('en-GB');
                setCandidateInfo(data);
            } else {
                console.error('Failed to fetch candidate information');
            }
        } catch (error) {
            console.error('Error fetching candidate information:', error);
        }
    };

    const handleViewApplications = () => {
        navigate('/candidate/applications');
    };

    const handleManageCV = () => {
        navigate('/candidate/cv');
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
            navigate('/candidate/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div>
            <h2>Candidate Profile</h2>
            {candidateInfo && (
                <div>
                    <p><strong>First Name:</strong> {candidateInfo.firstName}</p>
                    <p><strong>Last Name:</strong> {candidateInfo.lastName}</p>
                    <p><strong>Email:</strong> {candidateInfo.email}</p>
                    <p><strong>Date of birth:</strong> {candidateInfo.dateOfBirth}</p>
                    <p><strong>Phone:</strong> {candidateInfo.phone}</p>
                    <p><strong>Address:</strong> {candidateInfo.address}</p>
                    <p><strong>State:</strong> {candidateInfo.state}</p>
                    <p><strong>Country:</strong> {candidateInfo.country}</p>
                </div>
            )}
            <h3>Actions</h3>
            <button onClick={handleViewApplications}>Applications</button>
            <button onClick={handleManageCV}>Manage CV</button>
            <button onClick={handleChangePassword}>Change Password</button>
            <button onClick={handleChangeEmail}>Change Email</button>
            <button onClick={handleDeleteAccount}>Delete Account</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default CandidateProfile;