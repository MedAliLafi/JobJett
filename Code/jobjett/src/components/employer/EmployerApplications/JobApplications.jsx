import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from "../NavBar/EmployerNavbar.jsx";

const JobApplications = () => {
    const { jobOfferID } = useParams();
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch(`http://localhost:9000/Employer/JobOffer/${jobOfferID}/applications`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setApplications(data);
                } else {
                    console.error(`Failed to fetch applications for job offer ${jobOfferID}`);
                }
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        fetchApplications();
    }, [jobOfferID]);

    return (
        <>
            <Navbar></Navbar>
            <div>
                <h2>Applications for Job Offer ID: {jobOfferID}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Candidate ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>State</th>
                            <th>Country</th>
                            <th>Date Applied</th>
                            <th>Status</th>
                            <th>Action</th> {/* Header for Action column */}
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((application) => (
                            <tr key={application.CandidateID}>
                                <td>{application.CandidateID}</td>
                                <td>{application.firstname}</td>
                                <td>{application.lastname}</td>
                                <td>{application.state}</td>
                                <td>{application.country}</td>
                                <td>{new Date(application.DateApplied).toLocaleDateString('en-GB')}</td>
                                <td>{application.Status}</td>
                                {/* Add additional fields for CV info */}
                                <td>
                                    <Link to={`/employer/applications/${jobOfferID}/${application.ApplicationID}`}>
                                        View Application
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default JobApplications;
