    import React, { useState, useEffect } from 'react';

    function CV() {
        const [candidateInfo, setCandidateInfo] = useState({});
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
                        setSummary(cvData.Summary);
                        setSearchable(cvData.Searchable === 'true');
                        setSkills(cvData.Skills.split(';'));
                    } else {
                        console.error('Failed to fetch CV data');
                    }


                    const educationResponse = await fetchExistingData('getEducation');
                    if (educationResponse.ok) {
                        const educationData = await educationResponse.json();
                        const educationFormsData = educationData.map(education => {
                            const [fromDatePart, toDatePart] = education.TimePeriod.split('_');
                            const currentlyEnrolled = toDatePart === 'Present';
                            return {
                                Level: education.Level,
                                FieldOfStudy: education.FieldOfStudy,
                                School: education.School,
                                fromDatePart,
                                toDatePart,
                                currentlyEnrolled
                            };
                        });
                        setEducationForms(educationFormsData);
                    } else {
                        console.error('Failed to fetch existing education data');
                    }

                    const workExperienceResponse = await fetchExistingData('getWorkExperience');
                    if (workExperienceResponse.ok) {
                        const workExperienceData = await workExperienceResponse.json();
                        const workExperienceFormsData = workExperienceData.map(workExperience => {
                            const [fromDatePart, toDatePart] = workExperience.TimePeriod.split('_');
                            const currentlyWorkHere = toDatePart === 'Present';
                            return {
                                JobTitle: workExperience.JobTitle,
                                Company: workExperience.Company,
                                fromDatePart,
                                toDatePart,
                                currentlyWorkHere,
                                Description: workExperience.Description
                            };
                        });
                        setWorkExperienceForms(workExperienceFormsData);
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
        
        function renderEducationForms() {
            return educationForms.map((education, index) => (
                <div key={index}>
                    <input type="text" placeholder="Level of Education" value={education.Level} onChange={(e) => handleFormChange(e, index, 'Level', 'education')} />
                    <input type="text" placeholder="Field of Study" value={education.FieldOfStudy} onChange={(e) => handleFormChange(e, index, 'FieldOfStudy', 'education')} />
                    <input type="text" placeholder="School" value={education.School} onChange={(e) => handleFormChange(e, index, 'School', 'education')} />
                    <input type="month" placeholder="From Date" value={education.fromDatePart} onChange={(e) => handleFormChange(e, index, 'fromDatePart', 'education')} />
                    <input type="month" value={education.toDatePart} disabled={education.currentlyEnrolled} onChange={(e) => handleFormChange(e, index, 'toDatePart', 'education')} />
                    <input type="checkbox" id={`currentlyEnrolled_${index}`} checked={education.currentlyEnrolled} onChange={(e) => handleCurrentlyEnrolledChange(e, index)} />
                    <label htmlFor={`currentlyEnrolled_${index}`}>Currently Enrolled</label>    
                    <button onClick={() => removeFormItem('education', index)}>Delete</button>
                </div>
            ));
        }
        
        function renderWorkExperienceForms() {
            return workExperienceForms.map((workExperience, index) => (
                <div key={index}>
                    <input type="text" placeholder="Job Title" value={workExperience.JobTitle} onChange={(e) => handleFormChange(e, index, 'JobTitle', 'workExperience')} />
                    <input type="text" placeholder="Company" value={workExperience.Company} onChange={(e) => handleFormChange(e, index, 'Company', 'workExperience')} />
                    <input type="month" placeholder="From Date" value={workExperience.fromDatePart} onChange={(e) => handleFormChange(e, index, 'fromDatePart', 'workExperience')} />
                    <input type="month"  value={workExperience.toDatePart}  disabled={workExperience.currentlyWorkHere} onChange={(e) => handleFormChange(e, index, 'toDatePart', 'workExperience')} />
                    <input type="checkbox" id={`currentlyWorkHere_${index}`} checked={workExperience.currentlyWorkHere} onChange={(e) => handleCurrentlyWorkHereChange(e, index)} />
                    <label htmlFor={`currentlyWorkHere_${index}`}>I Currently Work Here</label>
                    <input type="text" placeholder="Description" value={workExperience.Description} onChange={(e) => handleFormChange(e, index, 'Description', 'workExperience')} />
                    <button onClick={() => removeFormItem('workExperience', index)}>Delete</button>
                </div>
            ));
        }
        
        function renderCertificatesForms() {
            return certificatesForm.map((certificate, index) => (
                <div key={index}>
                    <input type="text" placeholder="Certification Name" value={certificate.certification} onChange={(e) => handleFormChange(e, index, 'certification', 'certificate')} />
                    <input type="month" placeholder="Date Issued" value={certificate.DateIssued} onChange={(e) => handleFormChange(e, index, 'DateIssued', 'certificate')} />
                    <input type="text" placeholder="Description" value={certificate.description} onChange={(e) => handleFormChange(e, index, 'description', 'certificate')} />
                    <button onClick={() => removeFormItem('certificate', index)}>Delete</button>
                </div>
            ));
        }    

        function handleChangeSearchable(event) {
            setSearchable(event.target.checked);
        }
        

        function handleChangeSummary(event) {
            setSummary(event.target.value);
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
        function removeFormItem(type, index) {
            if (type === 'education') {
                setEducationForms(prevForms => prevForms.filter((_, i) => i !== index));
            } else if (type === 'workExperience') {
                setWorkExperienceForms(prevForms => prevForms.filter((_, i) => i !== index));
            } else if (type === 'certificate') {
                setCertificatesForm(prevForms => prevForms.filter((_, i) => i !== index));
            }
        }

        function removeSkill(index) {
            setSkills(prevSkills => prevSkills.filter((_, i) => i !== index));
        }

        function handleAddEducation() {
            setEducationForms(prevForms => [...prevForms, {
                level: '',
                fieldOfStudy: '',
                school: '',
                fromDate: '',
                toDate: '',
                currentlyEnrolled: false
            }]);
        }

        function handleAddWorkExperience() {
            setWorkExperienceForms(prevForms => [...prevForms, {
                jobTitle: '',
                company: '',
                fromDate: '',
                toDate: '',
                currentlyWorkHere: false,
                description: ''
            }]);
        }

        function handleAddCertificate() {
            setCertificatesForm(prevForms => [...prevForms, {
                certification: '',
                DateIssued: '',
                description: ''
            }]);
        }

        function handleCurrentlyEnrolledChange(event, index) {
            const isChecked = event.target.checked;
            setEducationForms(prevForms => {
                const updatedForms = [...prevForms];
                updatedForms[index].currentlyEnrolled = isChecked;
                if (isChecked) {
                    updatedForms[index].toDatePart = 'Present';
                }
                return updatedForms;
            });
        }

        function handleCurrentlyWorkHereChange(event, index) {
            const isChecked = event.target.checked;
            setWorkExperienceForms(prevForms => {
                const updatedForms = [...prevForms];
                updatedForms[index].currentlyWorkHere = isChecked;
                if (isChecked) {
                    updatedForms[index].toDatePart = 'Present';
                }
                return updatedForms;
            });
        }
        
        function handleToDateChange(event, index, formType) {
            const value = event.target.value;
            if (formType === 'education') {
                setEducationForms(prevForms => {
                    const updatedForms = [...prevForms];
                    updatedForms[index].toDatePart = value;
                    return updatedForms;
                });
            } else if (formType === 'workExperience') {
                setWorkExperienceForms(prevForms => {
                    const updatedForms = [...prevForms];
                    updatedForms[index].toDatePart = value;
                    return updatedForms;
                });
            }
        }

        function handleFormChange(event, index, fieldName, formType) {
            const { value } = event.target;
            switch (formType) {
                case 'education':
                    setEducationForms(prevForms => {
                        const updatedForms = [...prevForms];
                        updatedForms[index][fieldName] = value;
                        return updatedForms;
                    });
                    break;
                case 'workExperience':
                    setWorkExperienceForms(prevForms => {
                        const updatedForms = [...prevForms];
                        updatedForms[index][fieldName] = value;
                        return updatedForms;
                    });
                    break;
                case 'certificate':
                    setCertificatesForm(prevForms => {
                        const updatedForms = [...prevForms];
                        updatedForms[index][fieldName] = value;
                        return updatedForms;
                    });
                    break;
                default:
                    break;
            }
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
        
                // Now, update the CV data
                const cvData = {
                    summary,
                    skills: skills.join(';'), // Convert array to string
                    searchable
                };
        
                // Update CV on the server
                const updateResponse = await fetch('http://localhost:9000/Candidate/cv/updateCV', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(cvData)
                });
        
                if (!updateResponse.ok) {
                    throw new Error('Failed to update CV');
                }
        
                // Now, add new education data
                for (const education of educationForms) {
                    const educationData = {
                        cvId,
                        level: education.Level,
                        fieldOfStudy: education.FieldOfStudy,
                        school: education.School,
                        TimePeriod: `${education.fromDatePart}_${education.toDatePart}`
                    };
                    console.log('Posting education data:', educationData); // Logging education data

                    // Add education on the server
                    const addEducationResponse = await fetch('http://localhost:9000/Candidate/cv/addEducation', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify(educationData)
                    });
        
                    if (!addEducationResponse.ok) {
                        throw new Error('Failed to add education');
                    }
                }
        
                // Inside the submitCV function, after adding education
                for (const workExperience of workExperienceForms) {
                    const workExperienceData = {
                        cvId,
                        jobTitle: workExperience.JobTitle,
                        company: workExperience.Company,
                        TimePeriod: `${workExperience.fromDatePart}_${workExperience.toDatePart}`,
                        description: workExperience.Description
                    };
                    console.log('Posting work experience data:', workExperienceData);

                    // Add work experience on the server
                    const addWorkExperienceResponse = await fetch('http://localhost:9000/Candidate/cv/addWorkExperience', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify(workExperienceData)
                    });

                    if (!addWorkExperienceResponse.ok) {
                        throw new Error('Failed to add work experience');
                    }
                }
                // Inside the submitCV function, after adding work experience
                for (const certificate of certificatesForm) {
                    const certificateData = {
                        cvId,
                        certification: certificate.certification,
                        dateIssued: certificate.DateIssued,
                        description: certificate.description
                    };
                    console.log('Posting certificate data:', certificateData);

                    // Add certificate on the server
                    const addCertificateResponse = await fetch('http://localhost:9000/Candidate/cv/addCertificate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify(certificateData)
                    });

                    if (!addCertificateResponse.ok) {
                        throw new Error('Failed to add certificate');
                    }
                }
        
                alert('CV submitted successfully');
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
                        <button onClick={handleAddEducation}>Add Education</button>
                    </fieldset>

                    <fieldset>
                        <legend>Work Experience</legend>
                        {renderWorkExperienceForms()}
                        <button onClick={handleAddWorkExperience}>Add Work Experience</button>
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
                        <button onClick={handleAddCertificate}>Add Certificates</button>
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