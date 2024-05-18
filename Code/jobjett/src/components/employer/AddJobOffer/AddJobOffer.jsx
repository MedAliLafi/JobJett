import React, { useState } from 'react';
import Navbar from "../NavBar/EmployerNavbar.jsx";
import { useNavigate, Link } from 'react-router-dom';
import AddJobOffer1 from "./AddJobOffer1";
import AddJobOffer2 from "./AddJobOffer2";
import AddJobOffer3 from "./AddJobOffer3";
import "./AddJobOffer.css";

const AddJobOffer = () => {
    const navigate = useNavigate();
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
        payType: 'Exact',
        pay: '',
        payFrequency: '',
        jobDescription: '',
        reqEducation:'',
        reqExperience:'',
        reqSkills:'',
        reqSoftSkills:'',
        additionalQuestions:'No',
    });
    
    const submitJobOffer = async () => {
        const requiredFields = [
            'jobTitle',
            'jobDepartment',
            'jobDescription',
            'reqEducation',
            'reqExperience',
            'jobType',
            'jobSchedule',
            'jobLocationType',
            'payType',
            'payFrequency',
            'pay',
        ];
        
        for (const field of requiredFields) {
            if (!formData[field]) {
                alert(`${field} is required.`);
                // Handle error for missing required field
                return;
            }
        }
        
        // Skills and soft skills validation
        if ((!formData.reqSkills || formData.reqSkills.split(';code;').length < 2)) {
            alert('At least one skill is required.');
            // Handle error for missing required skills
            return;
        }
        
        if ((!formData.reqSoftSkills || formData.reqSoftSkills.split(';code;').length < 2)) {
            alert('At least one soft skill is required.');
            // Handle error for missing required soft skills
            return;
        }
        
        // Additional questions validation
        if (formData.additionalQuestions !== 'No' && (!formData.additionalQuestions || formData.additionalQuestions.split(';code;').length < 2)) {
            alert('You didnt type the additional questions.');
            // Handle error for missing additional questions
            return;
        }
        
        if ((formData.payType === 'Exact' || formData.payType === 'Min' || formData.payType === 'Max') && (!formData.pay)) {
            alert('Salary amount is required.');
            // Handle error for missing salary amount
            return;
        }        
        
        if (formData.payType === 'Range') {
            const rangeValues = formData.pay.split('-');
            if (rangeValues.length !== 2 || !rangeValues[0] || !rangeValues[1] || isNaN(rangeValues[0]) || isNaN(rangeValues[1]) || parseInt(rangeValues[0]) >= parseInt(rangeValues[1])) {
                alert('Salary range format is invalid. Please provide a valid range where the first value is less than the second value.');
                // Handle error for invalid salary range format
                return;
            }
        }
        
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
                navigate("/employer/applications");
            } else {
                const errorData = await response.json();
                console.error(errorData);
                alert(`${errorData.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle network errors
        }
    };
    
    return (
        <>
        <Navbar></Navbar>
        <div>
        {currentForm === 1 && <AddJobOffer1 formData={formData} setFormData={setFormData} />}
        {currentForm === 2 && <AddJobOffer2 formData={formData} setFormData={setFormData} />}
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