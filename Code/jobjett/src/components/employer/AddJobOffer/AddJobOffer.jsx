import React, { useState } from 'react';
import Navbar from "../NavBar/EmployerNavbar.jsx";
import AddJobOffer1 from "./AddJobOffer1";
import AddJobOffer2 from "./AddJobOffer2";
import AddJobOffer3 from "./AddJobOffer3";
import "./AddJobOffer.css";

const AddJobOffer = () => {
    const [currentForm, setCurrentForm] = useState(1);

    const handleNext = () => {
      setCurrentForm(currentForm + 1);
    };
  
    const handleBack = () => {
      setCurrentForm(currentForm - 1);
    };
    const [formData, setFormData] = useState({
        jobTitle: '',
        jobDepartment:'',
        jobLocationType: '',
        jobType: '',
        jobSchedule:'',
        payType: '',
        pay: '',
        payFrequency: '',
        jobDescription: '',
        reqEducation:'',
        reqExperience:'',
        reqSkills:'',
        reqSoftSkills:'',
    });
    
    const submitJobOffer = async () => {
        try {
            const response = await fetch('http://localhost:9000/Employer/JobOffer/addJobOffer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            
            const result = await response.json();
            if (response.ok) {
                console.log(result.message);
                // Optionally, redirect or display a success message
            } else {
                console.error(result.error);
                // Handle error response
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle netwaaork errors
        }
    };
    
    return (
        <>
        <Navbar></Navbar>
        <div>
        {currentForm === 1 && <AddJobOffer1 />}
        {currentForm === 2 && <AddJobOffer2 />}
        {currentForm === 3 && <AddJobOffer3 formData={formData} setFormData={setFormData} />}

        {/* Render buttons based on current form */}
        <div className="flex justify-between max-w-xl mx-auto">
            {currentForm > 1 && (
            <button
                onClick={handleBack}
                className="text-white bg-blueColor hover:bg-blueColor focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  next-button"
            >
                Back
            </button>
            )}

            {/* Show 'Submit' instead of 'Next' on the last form */}
            {currentForm < 3 ? (
            <button
                onClick={handleNext}
                className="text-white bg-blueColor hover:bg-blueColor focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  next-button"
            >
                Next
            </button>
            ) : (
            <button
                type="submit"
                className="text-white bg-blueColor hover:bg-blueColor focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  next-button"
                onClick={submitJobOffer}
            >
                Submit
            </button>
            )}
        </div>
        </div>
        </>
    );
};

export default AddJobOffer;