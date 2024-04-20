import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../NavBar/EmployerNavbar.jsx";

const Application = () => {
    const { jobOfferID } = useParams();
    const [applications, setApplications] = useState([]);
    const [interviewDateTime, setInterviewDateTime] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch(`http://localhost:9000/Employer/JobOffer/${jobOfferID}/applications`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    const formattedApplications = data.map(application => ({
                        ...application,
                        DateApplied: new Date(application.DateApplied).toLocaleDateString('en-GB')
                    }));
                    setApplications(formattedApplications);
                } else {
                    console.error(`Failed to fetch applications for job offer ${jobOfferID}`);
                }
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        fetchApplications();
    }, [jobOfferID]);

    const handleDeleteCandidate = async (candidateID) => {

    };

    const handleSetInterview = (candidateID) => {
        setSelectedCandidate(candidateID);
    };

    const handleAddInterview = async () => {

    };

    return (
        <>
            <Navbar></Navbar>
            <div>
                <h2>Applications for Job Offer ID: {jobOfferID}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Candidate ID</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Date Applied</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((application) => (
                            <tr key={application.CandidateID}>
                                <td>{application.CandidateID}</td>
                                <td>{application.Description}</td>
                                <td>{application.Status}</td>
                                <td>{application.DateApplied}</td>
                                <td>
                                    <button onClick={() => handleDeleteCandidate(application.CandidateID)}>Delete Candidate</button>
                                    {application.Status !== 'Interview Scheduled' && (
                                        <button onClick={() => handleSetInterview(application.CandidateID)}>Set up interview</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Add interview section */}
                {selectedCandidate && (
                    <div>
                        <input type="datetime-local" value={interviewDateTime} onChange={(e) => setInterviewDateTime(e.target.value)} />
                        <button onClick={handleAddInterview}>Add Interview</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Application;
