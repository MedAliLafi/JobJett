import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './JobOfferDetails.css'

const JobOfferDetails = ({ JobOfferID, closeModal }) => {
    const [jobofferDetails, setJobOfferDetails] = useState(null);
    const { jobofferId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobOfferDetails();
    }, [jobofferId]);

    const fetchJobOfferDetails = async () => {
        try {
            const response = await fetch(`http://localhost:9000/Candidate/JobOffer/${JobOfferID}`, {
                credentials: 'include'
            });
            if (response.ok) {
                const jobofferDetails = await response.json();
                jobofferDetails.DatePosted = new Date(jobofferDetails.DatePosted).toLocaleDateString('en-GB');
                setJobOfferDetails(jobofferDetails);
            } else {
                console.error('Failed to fetch job offer details');
            }
        } catch (error) {
            console.error('Error fetching job offer details:', error);
        }
    };

    const redirectToApplication = () => {
        navigate(`/candidate/application?jobofferId=${JobOfferID}`);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h1>Job Offer Details</h1>
                {jobofferDetails && (
                    <div>
                        <p><strong>Job Title:</strong> {jobofferDetails.Title}</p>
                        <p><strong>Description:</strong> {jobofferDetails.Description}</p>
                        <p><strong>Type:</strong> {jobofferDetails.Type}</p>
                        <p><strong>Salary:</strong> {jobofferDetails.Salary}</p>
                        <p><strong>Location:</strong> {jobofferDetails.Location}</p>
                        <p><strong>Date Posted:</strong> {jobofferDetails.DatePosted}</p>
                        <p><strong>Department:</strong> {jobofferDetails.Department}</p>
                        <p><strong>Schedule:</strong> {jobofferDetails.Schedule}</p>
                        <p><strong>Required Education:</strong> {jobofferDetails.ReqEducation}</p>
                        <p><strong>Required Experience:</strong> {jobofferDetails.ReqExperience}</p>
                        <p><strong>Required Skills:</strong> {jobofferDetails.ReqSkills}</p>
                        <p><strong>Required Soft Skills:</strong> {jobofferDetails.ReqSoftSkills}</p>
                    </div>
                )}
                <div className="button">
                <button onClick={redirectToApplication}
                className="border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold text-black hover:bg-white group-hover/item:text-black group-hover:text-white "
                >Apply Now</button></div>
            </div>
        </div>
    );
};

export default JobOfferDetails;
