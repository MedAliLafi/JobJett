import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../NavBar/EmployerNavbar.jsx";
import { useNavigate } from "react-router-dom";

const CandidateDetails = () => {
    const { candidateID } = useParams();
    const { applicationID } = useParams();
    const [application, setApplication] = useState(null);
    const [workExperiences, setWorkExperiences] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [education, setEducation] = useState([]);
    const navigate = useNavigate();

    const handleOfferJob = (CandidateID) => {
        navigate(`/employer/offerajob/${CandidateID}`);
      };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const applicationResponse = await fetch(`http://localhost:9000/Employer/JobOffer/${applicationID}/application`, {
                    credentials: 'include'
                });
                const workExperienceResponse = await fetch(`http://localhost:9000/Employer/JobOffer/candidate/${candidateID}/work_experience`, {
                    credentials: 'include'
                });
                const certificatesResponse = await fetch(`http://localhost:9000/Employer/JobOffer/candidate/${candidateID}/certificates`, {
                    credentials: 'include'
                });
                const educationResponse = await fetch(`http://localhost:9000/Employer/JobOffer/candidate/${candidateID}/education`, {
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

return (
    <>
        <Navbar />
        <div className="container mx-auto mt-8">
            {application && (
                <>
                    <h2 className="text-center text-blue-600 text-2xl font-semibold mb-4">
                        Candidate Details {applicationID}
                    </h2>
                    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                        <p className="font-semibold">Candidate Details</p>
                        <p>First Name: {application.firstname}</p>
                        <p>Last Name: {application.lastname}</p>
                        <p>State: {application.state}</p>
                        <p>Country: {application.country}</p>
                    </div>
                </>
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
                <button onClick={handleOfferJob} className="text-white bg-red-600 hover:bg-red-700 rounded-md px-4 py-2">
                Offer A Job    
                </button>
            </div>
        </div>
    </>
);
};

export default CandidateDetails;
