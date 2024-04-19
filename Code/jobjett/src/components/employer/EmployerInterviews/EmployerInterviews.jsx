import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../NavBar/EmployerNavbar.jsx";

const EmployerInterviews = () => {
    const { jobOfferID } = useParams();
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const response = await fetch(`http://localhost:9000/Employer/JobOffer/${jobOfferID}/interviews`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    const formattedInterviews = data.map(interview => ({
                        ...interview,
                        Date: new Date(interview.Date).toLocaleDateString('en-GB'),
                        Status: interview.Status === 'Pending' ? 'Pending' : new Date(interview.Status).toLocaleString('en-GB')
                    }));
                    setInterviews(formattedInterviews);
                } else {
                    console.error(`Failed to fetch interviews for job offer ${jobOfferID}`);
                }
            } catch (error) {
                console.error('Error fetching interviews:', error);
            }
        };

        fetchInterviews();
    }, [jobOfferID]);

    return (
        <>
            <Navbar></Navbar>
            <div>
                <h2>Interviews for Job Offer ID: {jobOfferID}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Candidate ID</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {interviews.map((interview) => (
                            <tr key={interview.CandidateID}>
                                <td>{interview.CandidateID}</td>
                                <td>{interview.Description}</td>
                                <td>{interview.Status}</td>
                                <td>{interview.Date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default EmployerInterviews;
