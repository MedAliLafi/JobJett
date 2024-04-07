import React, { useState } from 'react';

const AddJobOffer = () => {
    const [formData, setFormData] = useState({
        jobTitle: '',
        jobLocationType: '',
        jobType: '',
        payType: '',
        pay: '',
        payFrequency: '',
        jobDescription: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

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
            // Handle network errors
        }
    };

    return (
        <div>
            <h1>Add Job Offer Page</h1>
            <form id="jobOfferForm">
                <div className="form-section">
                    <label htmlFor="jobTitle">Job Title:</label>
                    <input type="text" id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required />
                </div>

                <div className="form-section">
                    <label htmlFor="jobLocationType">Job Location Type:</label>
                    <select id="jobLocationType" name="jobLocationType" value={formData.jobLocationType} onChange={handleChange} required>
                        <option value="">Select Location Type</option>
                        <option value="In-person, precise location">In-person, precise location</option>
                        <option value="In-person, within a limited area">In-person, within a limited area</option>
                        <option value="Fully remote: no on-site work required">Fully remote: no on-site work required</option>
                        <option value="Hybrid: some on-site work required">Hybrid: some on-site work required</option>
                        <option value="On the road">On the road</option>
                    </select>
                </div>

                <div className="form-section">
                    <label htmlFor="jobType">Job Type:</label>
                    <select id="jobType" name="jobType" value={formData.jobType} onChange={handleChange} required>
                        <option value="">Select Job Type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Temporary">Temporary</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>

                <div className="form-section" id="paySection">
                    <label htmlFor="payType">Pay Type:</label>
                    <select id="payType" name="payType" value={formData.payType} onChange={handleChange} required>
                        <option value="">Select Pay Type</option>
                        <option value="Starting amount">Starting amount</option>
                        <option value="Maximum amount">Maximum amount</option>
                        <option value="Exact amount">Exact amount</option>
                    </select>
                
                    <div id="payInput">
                        <label htmlFor="pay">Amount:</label>
                        <input type="text" id="pay" name="pay" value={formData.pay} onChange={handleChange} required />
                    </div>
                
                    <label htmlFor="payFrequency">Pay Frequency:</label>
                    <select id="payFrequency" name="payFrequency" value={formData.payFrequency} onChange={handleChange} required>
                        <option value="">Select Pay Frequency</option>
                        <option value="per year">per year</option>
                        <option value="per month">per month</option>
                        <option value="per week">per week</option>
                        <option value="per day">per day</option>
                        <option value="per hour">per hour</option>
                    </select>
                </div>    

                <div className="form-section">
                    <label htmlFor="jobDescription">Job Description:</label>
                    <textarea id="jobDescription" name="jobDescription" value={formData.jobDescription} onChange={handleChange} required />
                </div>

                <button type="button" onClick={submitJobOffer}>Submit</button>
            </form>
        </div>
    );
};

export default AddJobOffer;