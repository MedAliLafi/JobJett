import React, { useState, useEffect } from 'react';

function CV() {
    const [candidateInfo, setCandidateInfo] = useState({});
    const [cvData, setCVData] = useState({});
    const [educationForms, setEducationForms] = useState([]);
    const [workExperienceForms, setWorkExperienceForms] = useState([]);
    const [certificatesForm, setCertificatesForm] = useState([]);
    const [summary, setSummary] = useState('');
    const [searchable, setSearchable] = useState(false);
    const [skills, setSkills] = useState([]);
    const [cvId, setCVId] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const candidateInfoResponse = await fetchCandidateInfo();
                if (candidateInfoResponse.ok) {
                    const candidateInfoData = await candidateInfoResponse.json();
                    setCandidateInfo(candidateInfoData);
                    setCVId(candidateInfoData.cvId);
                } else {
                    console.error('Failed to fetch candidate information');
                }

                const cvResponse = await fetchExistingData('getCV');
                if (cvResponse.ok) {
                    const cvData = await cvResponse.json();
                    setCVData(cvData);
                    setSummary(cvData.Summary);
                    setSearchable(cvData.Searchable);
                    setSkills(cvData.Skills.split(';'));
                } else {
                    console.error('Failed to fetch CV data');
                }

                const educationResponse = await fetchExistingData('getEducation');
                if (educationResponse.ok) {
                    const educationData = await educationResponse.json();
                    setEducationForms(educationData);
                } else {
                    console.error('Failed to fetch existing education data');
                }

                const workExperienceResponse = await fetchExistingData('getWorkExperience');
                if (workExperienceResponse.ok) {
                    const workExperienceData = await workExperienceResponse.json();
                    setWorkExperienceForms(workExperienceData);
                } else {
                    console.error('Failed to fetch existing work experience data');
                }

                const certificateResponse = await fetchExistingData('getCertificate');
                if (certificateResponse.ok) {
                    const certificateData = await certificateResponse.json();
                    setCertificatesForm(certificateData);
                } else {
                    console.error('Failed to fetch existing certificate data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    async function fetchCandidateInfo() {
        const response = await fetch('http://localhost:9000/Candidate/candidateInfo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        return response;
    }
    
    async function fetchExistingData(endpoint) {
        const response = await fetch(`http://localhost:9000/Candidate/cv/${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        return response;
    }
    
    async function deleteExistingData(endpoint) {
        try {
            await fetch(`http://localhost:9000/Candidate/cv/${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    }
    
    async function updateCV() {
        try {
            await fetch('http://localhost:9000/Candidate/cv/updateCV', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    summary,
                    skills: skills.join(';'),
                    searchable
                }),
                credentials: 'include'
            });
        } catch (error) {
            console.error('Error updating CV:', error);
        }
    }
    
    function renderEducationForms() {
        return educationForms.map((education, index) => (
            <div key={index}>
                <input type="text" placeholder="Level of Education" value={education.level} />
                <input type="text" placeholder="Field of Study" value={education.fieldOfStudy} />
                <input type="text" placeholder="School" value={education.school} />
                <input type="month" placeholder="From Date" value={education.fromDate} />
                <input type="month" placeholder="To Date" value={education.toDate} />
                <input type="checkbox" placeholder="Currently Enrolled" checked={education.currentlyEnrolled} />
            </div>
        ));
    }

    function renderWorkExperienceForms() {
        return workExperienceForms.map((workExperience, index) => (
            <div key={index}>
                <input type="text" placeholder="Job Title" value={workExperience.jobTitle} />
                <input type="text" placeholder="Company" value={workExperience.company} />
                <input type="month" placeholder="From Date" value={workExperience.fromDate} />
                <input type="month" placeholder="To Date" value={workExperience.toDate} />
                <input type="checkbox" placeholder="Currently Work Here" checked={workExperience.currentlyWorkHere} />
                <input type="text" placeholder="Description" value={workExperience.description} />
            </div>
        ));
    }

    function renderCertificatesForms() {
        return certificatesForm.map((certificate, index) => (
            <div key={index}>
                <input type="text" placeholder="Certification Name" value={certificate.certificateName} />
                <input type="month" placeholder="Date Issued" value={certificate.dateIssued} />
                <input type="text" placeholder="Description" value={certificate.description} />
            </div>
        ));
    }
    

    function handleChangeSummary(event) {
        setSummary(event.target.value);
    }

    function handleChangeSearchable(event) {
        setSearchable(event.target.checked);
    }

    function addSkill(event) {
        if (event.keyCode === 13) {
            const skillInput = event.target.value.trim();
            if (skillInput !== '') {
                setSkills(prevSkills => [...prevSkills, skillInput]);
                event.target.value = '';
            }
        }
    }

    function removeSkill(index) {
        setSkills(prevSkills => prevSkills.filter((_, i) => i !== index));
    }

    
    async function submitCV() {
        try {
            // Delete existing education data
            await fetch('http://localhost:9000/Candidate/cv/deleteEducation', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            // Delete existing work experience data
            await fetch('http://localhost:9000/Candidate/cv/deleteWorkExperience', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            // Delete existing certificate data
            await fetch('http://localhost:9000/Candidate/cv/deleteCertificate', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            // Update CV
            const summary = document.getElementById('summary').value;
            const skillsDiv = document.getElementById('skillsList');
            const skills = Array.from(skillsDiv.children).filter(child => child.tagName === 'DIV').map(skill => skill.textContent).join(';'); // Join skills with a delimiter
            const searchable = document.getElementById('searchable').checked;
            const cvResponse = await fetch('http://localhost:9000/Candidate/cv/updateCV', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    summary,
                    skills,
                    searchable
                }),
                credentials: 'include'
            });
            if (!cvResponse.ok) {
                throw new Error('Failed to update CV');
            }

            // Add Certificates
            const certificatesFormsDiv = document.getElementById('certificationsForm');
            if (certificatesFormsDiv.children.length > 0) {
                await Promise.all(Array.from(certificatesFormsDiv.children).map(async form => {
                    const certificateName = form.querySelector('input[type="text"]').value;
                    const dateIssued = form.querySelector('input[type="month"]').value;
                    const description = form.querySelector('input[type="text"]').value;
                    await fetch('http://localhost:9000/Candidate/cv/addCertificate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            cvId,
                            certificateName,
                            dateIssued,
                            description
                        }),
                        credentials: 'include'
                    });
                }));
            }

            // Add Education
            const educationFormsDiv = document.getElementById('educationForms');
            if (educationFormsDiv.children.length > 0) {
                await Promise.all(Array.from(educationFormsDiv.children).map(async form => {
                    const level = form.querySelector('input[placeholder="Level of Education"]').value;
                    const fieldOfStudy = form.querySelector('input[placeholder="Field of Study"]').value;
                    const school = form.querySelector('input[placeholder="School"]').value;
                    const fromDate = form.querySelector('input[type="month"]').value;
                    let toDate = form.querySelector('input[type="month"]').value;
                    const currentlyEnrolled = form.querySelector('input[type="checkbox"]').checked;
                    if (currentlyEnrolled) {
                        toDate = 'Present';
                    }
                    let TimePeriod = fromDate + '_' + toDate;
                    await fetch('http://localhost:9000/Candidate/cv/addEducation', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            cvId,
                            level,
                            fieldOfStudy,
                            school,
                            TimePeriod
                        }),
                        credentials: 'include'
                    });
                }));
            }

            // Add Work Experience
            const workExperienceFormsDiv = document.getElementById('workExperienceForms');
            if (workExperienceFormsDiv.children.length > 0) {
                await Promise.all(Array.from(workExperienceFormsDiv.children).map(async form => {
                    const jobTitle = form.querySelector('input[placeholder="Job Title"]').value;
                    const company = form.querySelector('input[placeholder="Company"]').value;
                    const fromDate = form.querySelector('input[type="month"]').value;
                    let toDate = form.querySelector('input[type="month"]').value;
                    const currentlyWorkHere = form.querySelector('input[type="checkbox"]').checked;
                    if (currentlyWorkHere) {
                        toDate = 'Present';
                    }
                    let TimePeriod = fromDate + '_' + toDate;
                    const description = form.querySelector('input[placeholder="Description"]').value;
                    await fetch('http://localhost:9000/Candidate/cv/addWorkExperience', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            cvId,
                            jobTitle,
                            company,
                            TimePeriod,
                            description
                        }),
                        credentials: 'include'
                    });
                }));
            }

            alert('CV submitted successfully', cvId);

        } catch (error) {
            console.error('Error submitting CV:', error);
            alert('Failed to submit CV. Please try again later.');
        }
    }


    return (
        <div>
            <h2>Candidate Resume</h2>
            <div id="candidateInfo">
                <p><strong>First Name:</strong> {candidateInfo.firstName}</p>
                <p><strong>Last Name:</strong> {candidateInfo.lastName}</p>
                <p><strong>Phone:</strong> {candidateInfo.phone}</p>
                <p><strong>Address:</strong> {candidateInfo.address}</p>
                <p><strong>State:</strong> {candidateInfo.state}</p>
                <p><strong>Country:</strong> {candidateInfo.country}</p>             
            </div>

            <div>
                <div>
                    <label htmlFor="summary">Summary:</label>
                    <textarea id="summary" value={summary} onChange={handleChangeSummary}></textarea>
                </div>

                <fieldset>
                    <legend>Education</legend>
                    {renderEducationForms()}
                    <button>Add Education</button>
                </fieldset>

                <fieldset>
                    <legend>Work Experience</legend>
                    {renderWorkExperienceForms()}
                    <button>Add Work Experience</button>
                </fieldset>

                <fieldset>
                    <legend>Skills</legend>
                    <div>
                        <label htmlFor="skills">Add Skill:</label>
                        <input type="text" id="skills" onKeyDown={addSkill} />
                    </div>
                    <div>
                        {skills.map((skill, index) => (
                            <div key={index}>
                                {skill}
                                <button onClick={() => removeSkill(index)}>Delete</button>
                            </div>
                        ))}
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Certificates</legend>
                    {renderCertificatesForms()}
                    <button>Add Certificates</button>
                </fieldset>

                <div>
                    <label htmlFor="searchable">Searchable:</label>
                    <input type="checkbox" id="searchable" checked={searchable} onChange={handleChangeSearchable} />
                </div>

                <div>
                    <button type="submit" onClick={submitCV}>Submit</button>
                </div>
            </div>
        </div>
    );
}

export default CV;