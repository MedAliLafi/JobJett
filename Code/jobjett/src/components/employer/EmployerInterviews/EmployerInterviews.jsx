import React, { useState, useEffect } from 'react';
import Navbar from "../NavBar/EmployerNavbar.jsx";

const EmployerInterviews = () => {
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const response = await fetch('http://localhost:9000/Employer/Interview/getinterviews', {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    // Map over interviews and format the date
                    const formattedInterviews = data.map(interview => ({
                        ...interview,
                        CandidateName: `${interview.FirstName} ${interview.LastName}`,
                        InterviewDateTime: new Date(interview.InterviewDateTime).toLocaleString('en-GB', { 
                            timeZone: 'UTC',
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        })                    }));
                    setInterviews(formattedInterviews);
                } else {
                    console.error('Failed to fetch interviews');
                }
            } catch (error) {
                console.error('Error fetching interviews:', error);
            }
        };

        fetchInterviews();
    }, []);

    const cancelInterview = async (interviewID) => {
        try {
            const deleteResponse = await fetch(`http://localhost:9000/Employer/Interview/cancel`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ interviewID }),
                credentials: 'include'
            });
            if (!deleteResponse.ok) {
                throw new Error('Failed to cancel interview');
            }
            console.log('Interview canceled successfully.');
        } catch (error) {
            console.error('Error canceling interview:', error);
        }
    };   

    return (
        <>
            <Navbar />
            <div>
                <h2>Employer Interviews</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Interview ID</th>
                            <th>Job Title</th>
                            <th>Candidate Name</th>
                            <th>Interview Date & Time</th>
                            <th>Note</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {interviews.map((interview) => (
                            <tr key={interview.InterviewID}>
                                <td>{interview.InterviewID}</td>
                                <td>{interview.Title}</td>
                                <td>{interview.CandidateName}</td>
                                <td>{interview.InterviewDateTime}</td>
                                <td>{interview.Note}</td>
                                <td>
                                <button onClick={async () => {cancelInterview(interview.InterviewID)}}>Cancel</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default EmployerInterviews;
