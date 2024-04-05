import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const JobOfferDetails = () => {
    const [jobofferDetails, setJobOfferDetails] = useState(null);
    const { jobofferId } = useParams();

    useEffect(() => {
        fetchJobOfferDetails();
    }, [jobofferId]);

    const fetchJobOfferDetails = async () => {
        try {
            const response = await fetch(`http://localhost:9000/Candidate/JobOffer/${jobofferId}`, {
                credentials: 'include'
            });
            if (response.ok) {
                const jobofferDetails = await response.json();
                setJobOfferDetails(jobofferDetails);
            } else {
                console.error('Failed to fetch job offer details');
            }
        } catch (error) {
            console.error('Error fetching job offer details:', error);
        }
    };

    const redirectToApplication = () => {
        window.location.href = `/candidate/application?jobofferId=${jobofferId}`;
    };

    return (
        <div>
            <h2>Job Offer Details</h2>
            {jobofferDetails && (
                <div>
                    <p><strong>Job Title:</strong> {jobofferDetails.Title}</p>
                    <p><strong>Description:</strong> {jobofferDetails.Description}</p>
                    <p><strong>Type:</strong> {jobofferDetails.Type}</p>
                    <p><strong>Salary:</strong> {jobofferDetails.Salary}</p>
                    <p><strong>Location:</strong> {jobofferDetails.Location}</p>
                    <p><strong>Date Posted:</strong> {jobofferDetails.DatePosted}</p>
                </div>
            )}
            <button onClick={redirectToApplication}>Apply Now</button>
        </div>
    );
};

export default JobOfferDetails;
