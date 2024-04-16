import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployerNavbar from "./EmployerNavbar.jsx";

const EmployerApplications = () => {
  const [jobOffers, setJobOffers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch job offers
        const jobOffersResponse = await fetch(
          "http://localhost:9000/Employer/JobOffer/joboffers",
          {
            credentials: "include",
          }
        );
        if (jobOffersResponse.ok) {
          const jobOffersData = await jobOffersResponse.json();
          // Update job offers state
          setJobOffers(jobOffersData);

          // Fetch applications for each job offer
          for (const jobOffer of jobOffersData) {
            const applicationsResponse = await fetch(
              `http://localhost:9000/Employer/JobOffer/${jobOffer.JobOfferID}/applications`,
              {
                credentials: "include",
              }
            );
            if (applicationsResponse.ok) {
              const applications = await applicationsResponse.json();
              // Update job offer with applications
              jobOffer.applications = applications;
            } else {
              console.error(
                `Failed to fetch applications for job offer ${jobOffer.JobOfferID}`
              );
              jobOffer.applications = [];
            }
          }
          // Update job offers state with applications
          setJobOffers([...jobOffersData]);
        } else {
          console.error("Failed to fetch job offers");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <EmployerNavbar />
      <div>
        <h2>Employer Applications</h2>
        <div id="applicationsList">
          {jobOffers.length === 0 ? (
            <p>No job offers found.</p>
          ) : (
            jobOffers.map((jobOffer) => (
              <div key={jobOffer.JobOfferID}>
                <h3>Job Offer ID: {jobOffer.JobOfferID}</h3>
                <p>
                  <strong>Title:</strong> {jobOffer.Title}
                </p>
                <p>
                  <strong>Description:</strong> {jobOffer.Description}
                </p>
                <h4>Applications:</h4>
                <ul>
                  {jobOffer.applications && jobOffer.applications.length > 0 ? (
                    jobOffer.applications.map((application) => (
                      <li key={application.CandidateID}>
                        <strong>Candidate ID:</strong> {application.CandidateID}{" "}
                        -<strong>Description:</strong> {application.Description}{" "}
                        -<strong>Status:</strong> {application.Status} -
                        <strong>Date Applied:</strong> {application.DateApplied}
                      </li>
                    ))
                  ) : (
                    <p>No applications found for this job offer.</p>
                  )}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default EmployerApplications;
