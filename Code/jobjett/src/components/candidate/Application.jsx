import React from 'react';
import { useNavigate } from 'react-router-dom';

const Application = () => {
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const description = event.target.description.value.trim();
        const jobofferId = new URLSearchParams(window.location.search).get('jobofferId');

        if (description === '') {
            alert('Please enter a description for your application.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:9000/Candidate/JobOffer/${jobofferId}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description: description }),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to submit application');
            }

            alert('Application submitted successfully');
            navigate('/candidate/profile');
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('An error occurred while submitting your application');
        }
    };

    return (
        <div>
            <h2>Job Application</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="description">Description:</label><br />
                <textarea id="description" name="description" rows="4" cols="50"></textarea><br />
                <button type="submit">Submit Application</button>
            </form>
        </div>
    );
};

export default Application;
