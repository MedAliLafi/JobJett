import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../NavBar/EmployerNavbar.jsx";

const JobApplication = () => {
    const { applicationID } = useParams();
    const [application, setApplication] = useState(null);
    const [workExperiences, setWorkExperiences] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [education, setEducation] = useState([]);
    const [interviewDateTime, setInterviewDateTime] = useState('');
    const [showDateTimeInput, setShowDateTimeInput] = useState(false);
    const [message, setMessage] = useState('');
    const [showMessageInput, setShowMessageInput] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const applicationResponse = await fetch(`http://localhost:9000/Employer/JobOffer/${applicationID}/application`, {
                    credentials: 'include'
                });
                const workExperienceResponse = await fetch(`http://localhost:9000/Employer/JobOffer/application/${applicationID}/work_experience`, {
                    credentials: 'include'
                });
                const certificatesResponse = await fetch(`http://localhost:9000/Employer/JobOffer/application/${applicationID}/certificates`, {
                    credentials: 'include'
                });
                const educationResponse = await fetch(`http://localhost:9000/Employer/JobOffer/application/${applicationID}/education`, {
                    credentials: 'include'
                });

                if (applicationResponse.ok && workExperienceResponse.ok && certificatesResponse.ok && educationResponse.ok) {
                    const applicationData = await applicationResponse.json();
                    const workExperiencesData = await workExperienceResponse.json();
                    const certificatesData = await certificatesResponse.json();
                    const educationData = await educationResponse.json();

                    setApplication(applicationData[0]);
                    setWorkExperiences(workExperiencesData);
                    setCertificates(certificatesData);
                    setEducation(educationData);
                } else {
                    console.error(`Failed to fetch data for application ${applicationID}`);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
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
        <div className="container mx-auto mt-8">
            {application && (
                <>
                    <h2 className="text-center text-blue-600 text-2xl font-semibold mb-4">
                        Application {applicationID}
                    </h2>
                    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                        <p className="font-semibold">Candidate Details</p>
                        <p>First Name: {application.firstname}</p>
                        <p>Last Name: {application.lastname}</p>
                        <p>State: {application.state}</p>
                        <p>Country: {application.country}</p>
                        <p>Date Applied: {new Date(application.DateApplied).toLocaleDateString('en-GB')}</p>
                        <p>Status: {application.Status.includes('Interview Scheduled') ? 'Interview Scheduled' : application.Status}</p>
                    </div>
                </>
            )}
            {application && application.Type === 'Applied' && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <p className="font-semibold">Cover Letter</p>
                    <p>{application.Description}</p>
                </div>
            )}
            {/* Display work experiences */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-2">Work Experience</h3>
                <ul>
                    {workExperiences.map((experience, index) => (
                        <li key={index} className="mb-2">
                            <p className="font-semibold">Job title: {experience.JobTitle}</p>
                            <p>Company: {experience.Company}</p>
                            <p>Time Period: {experience.TimePeriod}</p>
                            <p>Description: {experience.Description}</p>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Display certificates */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-2">Certificates</h3>
                <ul>
                    {certificates.map((certificate, index) => (
                        <li key={index} className="mb-2">
                            <p className="font-semibold">Certification: {certificate.certification}</p>
                            <p>Date Issued: {certificate.DateIssued}</p>
                            <p>Description: {certificate.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Display education */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-2">Education</h3>
                <ul>
                    {education.map((edu, index) => (
                        <li key={index} className="mb-2">
                            <p className="font-semibold">Level: {edu.Level}</p>
                            <p>Field of study: {edu.FieldOfStudy}</p>
                            <p>School: {edu.School}</p>
                            <p>Time period: {edu.TimePeriod}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex justify-between items-center mb-6">
                {/* Modify the condition for displaying the "Set up interview" button */}
                {application && !application.Status.includes('Interview Scheduled') && (
                    <button onClick={handleSetInterview} className="text-white bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-2">
                        Set up interview
                    </button>
                )}
                <button onClick={handleDeleteCandidate} className="text-white bg-red-600 hover:bg-red-700 rounded-md px-4 py-2">
                    Delete Candidate
                </button>
            </div>
            {/* Add interview section */}
            {showDateTimeInput && showMessageInput && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h3 className="font-semibold mb-2">Schedule Interview</h3>
                    <div className="flex items-center">
                        <input type="datetime-local" value={interviewDateTime} onChange={(e) => setInterviewDateTime(e.target.value)} className="border rounded px-4 py-2 mr-4" />
                        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter Message" className="border rounded px-4 py-2 mr-4" />
                        <button onClick={handleAddInterview} className="text-white bg-green-600 hover:bg-green-700 rounded-md px-4 py-2">
                            Add Interview
                        </button>
                    </div>
                </div>
            )}
        </div>
    </>
);
};

export default JobApplication;
