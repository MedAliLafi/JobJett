import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../NavBar/EmployerNavbar.jsx";

const JobApplication = () => {
    const { applicationID } = useParams();
    const [application, setApplication] = useState({
        CandidateID: '',
        firstname: '',
        lastname: '',
        state: '',
        country: '',
        DateApplied: '',
        Status: ''
    });
    const [workExperiences, setWorkExperiences] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [education, setEducation] = useState([]);
    const [interviewDateTime, setInterviewDateTime] = useState('');
    const [showDateTimeInput, setShowDateTimeInput] = useState(false);
    const [message, setMessage] = useState('');
    const [showMessageInput, setShowMessageInput] = useState(false);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const response = await fetch(`http://localhost:9000/Employer/JobOffer/${applicationID}/application`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setApplication(data[0]);
                } else {
                    console.error(`Failed to fetch application for job offer ${applicationID}`);
                }
            } catch (error) {
                console.error('Error fetching application:', error);
            }
        };

        const fetchWorkExperiences = async () => {
            try {
                const response = await fetch(`http://localhost:9000/Employer/JobOffer/${applicationID}/work_experience`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setWorkExperiences(data);
                } else {
                    console.error(`Failed to fetch work experiences for application ${applicationID}`);
                }
            } catch (error) {
                console.error('Error fetching work experiences:', error);
            }
        };

        const fetchCertificates = async () => {
            try {
                const response = await fetch(`http://localhost:9000/Employer/JobOffer/${applicationID}/certificates`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setCertificates(data);
                } else {
                    console.error(`Failed to fetch certificates for application ${applicationID}`);
                }
            } catch (error) {
                console.error('Error fetching certificates:', error);
            }
        };

        const fetchEducation = async () => {
            try {
                const response = await fetch(`http://localhost:9000/Employer/JobOffer/${applicationID}/education`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setEducation(data);
                } else {
                    console.error(`Failed to fetch education for application ${applicationID}`);
                }
            } catch (error) {
                console.error('Error fetching education:', error);
            }
        };

        fetchApplication();
        fetchWorkExperiences();
        fetchCertificates();
        fetchEducation();
    }, [applicationID]);

    const handleDeleteCandidate = async () => {
        try {
            const response = await fetch(`http://localhost:9000/Employer/JobOffer/${applicationID}/deny`, {
                method: 'PUT',
                credentials: 'include'
            });
            if (response.ok) {
                setApplication(prevState => ({ ...prevState, Status: 'Rejected' }));
                console.log('Application status updated successfully.');
            } else {
                console.error(`Failed to update application status for job offer ${applicationID}`);
            }
        } catch (error) {
            console.error('Error updating application status:', error);
        }
    };

    const handleSetInterview = () => {
        setShowMessageInput(true);
        setShowDateTimeInput(true);
    };

    const handleAddInterview = async () => {
        try {
            const response = await fetch(`http://localhost:9000/Employer/Interview/${applicationID}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    interviewDateTime: interviewDateTime,
                    message: message,
                    CandidateID: application.CandidateID
                }),
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                const { interviewID } = data;
                setApplication(prevState => ({ ...prevState, Status: `Interview Scheduled` }));
                console.log('Interview scheduled successfully');
            } else {
                console.error('Failed to schedule interview');
            }
        } catch (error) {
            console.error('Error scheduling interview:', error);
        }
    };
    
    

    return (
        <>
            <Navbar />
            <div>
                {application && (
                    <>
                        <h2>Application: {applicationID}</h2>
                        <p>Candidate ID: {application.CandidateID}</p>
                        <p>First Name: {application.firstname}</p>
                        <p>Last Name: {application.lastname}</p>
                        <p>State: {application.state}</p>
                        <p>Country: {application.country}</p>
                        <p>Date Applied: {new Date(application.DateApplied).toLocaleDateString('en-GB')}</p>
                        {/* Modify the status display */}
                        <p>Status: {application.Status.includes('Interview Scheduled') ? 'Interview Scheduled' : application.Status}</p>
                    </>
                )}
                {/* Display work experiences */}
                <h3>Work Experience</h3>
                <ul>
                    {workExperiences.map((experience, index) => (
                        <li key={index}>
                            <p>Job Title: {experience.JobTitle}</p>
                            <p>Company: {experience.Company}</p>
                            <p>Time Period: {experience.TimePeriod}</p>
                            <p>Description: {experience.Description}</p>
                        </li>
                    ))}
                </ul>
                {/* Display certificates */}
                <h3>Certificates</h3>
                <ul>
                    {certificates.map((certificate, index) => (
                        <li key={index}>
                            <p>Certification: {certificate.certification}</p>
                            <p>Date Issued: {certificate.DateIssued}</p>
                            <p>Description: {certificate.description}</p>
                        </li>
                    ))}
                </ul>
                {/* Display education */}
                <h3>Education</h3>
                <ul>
                    {education.map((edu, index) => (
                        <li key={index}>
                            <p>Level: {edu.Level}</p>
                            <p>Field of Study: {edu.FieldOfStudy}</p>
                            <p>School: {edu.School}</p>
                            <p>Time Period: {edu.TimePeriod}</p>
                        </li>
                    ))}
                </ul>
                <button onClick={handleDeleteCandidate}>Delete Candidate</button>
                {/* Modify the condition for displaying the "Set up interview" button */}
                {application.Status && !application.Status.includes('Interview Scheduled') && (
                    <button onClick={handleSetInterview}>Set up interview</button>
                )}
                {/* Add interview section */}
                {showDateTimeInput && showMessageInput && (
                    <div>
                        <input type="datetime-local" value={interviewDateTime} onChange={(e) => setInterviewDateTime(e.target.value)} />
                        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter Message" />
                        <button onClick={handleAddInterview}>Add Interview</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default JobApplication;
