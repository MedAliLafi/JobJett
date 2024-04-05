import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CandidateApplications = () => {
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCandidateApplications();
    }, []);

    const fetchCandidateApplications = async () => {
        try {
            const response = await fetch('http://localhost:9000/Candidate/JobOffer/candidate_applications', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setApplications(data);
            } else {
                console.error('Failed to fetch candidate applications');
            }
        } catch (error) {
            console.error('Error fetching candidate applications:', error);
        }
    };

    return (
        <div>
            <h2>Candidate Applications</h2>
            <div>
                {applications.length === 0 ? (
                    <p>No applications found.</p>
                ) : (
                    <div>
                        <h3>Applications</h3>
                        <ul>
                            {applications.map(application => (
                                <li key={application.ApplicationID}>{application.Description} - Status: {application.Status}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CandidateApplications;
