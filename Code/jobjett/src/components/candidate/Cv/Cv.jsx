/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import Navbar from "../NavBar/CandidateNavbar.jsx";

function CV() {
  const [candidateInfo, setCandidateInfo] = useState({});
  const [educationForms, setEducationForms] = useState([]);
  const [workExperienceForms, setWorkExperienceForms] = useState([]);
  const [certificatesForm, setCertificatesForm] = useState([]);
  const [summary, setSummary] = useState("");
  const [searchable, setSearchable] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState([]);
  const [cvId, setCVId] = useState("");
  const handleChange = (event) => {
    setNewSkill(event.target.value);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const candidateInfoResponse = await fetchCandidateInfo();
        if (candidateInfoResponse.ok) {
          const candidateInfoData = await candidateInfoResponse.json();
          setCandidateInfo(candidateInfoData);
          setCVId(candidateInfoData.cvId);
        } else {
          console.error("Failed to fetch candidate information");
        }

        const cvResponse = await fetchExistingData("getCV");
        if (cvResponse.ok) {
          const cvData = await cvResponse.json();
          setSummary(cvData.Summary);
          setSearchable(cvData.Searchable === "true");
          setSkills(cvData.Skills.split(";"));
        } else {
          console.error("Failed to fetch CV data");
        }

        const educationResponse = await fetchExistingData("getEducation");
        if (educationResponse.ok) {
          const educationData = await educationResponse.json();
          const educationFormsData = educationData.map((education) => {
            const [fromDatePart, toDatePart] = education.TimePeriod.split("_");
            const currentlyEnrolled = toDatePart === "Present";
            return {
              Level: education.Level,
              FieldOfStudy: education.FieldOfStudy,
              School: education.School,
              fromDatePart,
              toDatePart,
              currentlyEnrolled,
            };
          });
          setEducationForms(educationFormsData);
        } else {
          console.error("Failed to fetch existing education data");
        }

        const workExperienceResponse = await fetchExistingData(
          "getWorkExperience"
        );
        if (workExperienceResponse.ok) {
          const workExperienceData = await workExperienceResponse.json();
          const workExperienceFormsData = workExperienceData.map(
            (workExperience) => {
              const [fromDatePart, toDatePart] =
                workExperience.TimePeriod.split("_");
              const currentlyWorkHere = toDatePart === "Present";
              return {
                JobTitle: workExperience.JobTitle,
                Company: workExperience.Company,
                fromDatePart,
                toDatePart,
                currentlyWorkHere,
                Description: workExperience.Description,
              };
            }
          );
          setWorkExperienceForms(workExperienceFormsData);
        } else {
          console.error("Failed to fetch existing work experience data");
        }

        const certificateResponse = await fetchExistingData("getCertificate");
        if (certificateResponse.ok) {
          const certificateData = await certificateResponse.json();
          setCertificatesForm(certificateData);
        } else {
          console.error("Failed to fetch existing certificate data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  async function fetchCandidateInfo() {
    const response = await fetch(
      "http://localhost:9000/Candidate/candidateInfo",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    return response;
  }

  async function fetchExistingData(endpoint) {
    const response = await fetch(
      `http://localhost:9000/Candidate/cv/${endpoint}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    return response;
  }

  function renderEducationForms() {
    return educationForms.map((education, index) => (
      <div key={index}>
        <div className="mb-4">
          <label
            htmlFor="level-of-education"
            className="block text-sm font-medium text-gray-700"
          >
            Level of education:
          </label>
          <select
            id="level-of-education"
            type="text"
            placeholder="Level of Education"
            value={education.Level}
            onChange={(e) => handleFormChange(e, index, "Level", "education")}
            className="mb-4 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="High School Diploma or Equivalent">
              High School Diploma or Equivalent
            </option>
            <option value="Associate's Degree">Associate's Degree</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree or Higher">
              Master's Degree or Higher
            </option>
            <option value="Vocational Training and Certifications">
              Vocational Training and Certifications
            </option>
            <option value="On-the-Job Training">On-the-Job Training</option>
          </select>

          <div className="flex space-x-4 mb-4">
            <div className="flex-grow">
              <label
                htmlFor={`fieldOfStudy_${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Field of Study:
              </label>
              <input
                id={`fieldOfStudy_${index}`}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="text"
                placeholder="Field of Study"
                value={education.FieldOfStudy}
                onChange={(e) =>
                  handleFormChange(e, index, "FieldOfStudy", "education")
                }
              />
            </div>
            <div className="flex-grow">
              <label
                htmlFor={`school_${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                School:
              </label>
              <input
                id={`school_${index}`}
                type="text"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="School"
                value={education.School}
                onChange={(e) =>
                  handleFormChange(e, index, "School", "education")
                }
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-grow">
              <label
                htmlFor={`fromDate_${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                From Date:
              </label>
              <input
                id={`fromDate_${index}`}
                type="month"
                placeholder="From Date"
                value={education.fromDatePart}
                onChange={(e) =>
                  handleFormChange(e, index, "fromDatePart", "education")
                }
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <div className="flex-grow">
              <label
                htmlFor={`toDate_${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                To Date:
              </label>
              <input
                id={`toDate_${index}`}
                type="month"
                value={education.toDatePart}
                disabled={education.currentlyEnrolled}
                onChange={(e) =>
                  handleFormChange(e, index, "toDatePart", "education")
                }
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <div className="flex items-center"></div>
          </div>
          <input
            type="checkbox"
            id={`currentlyEnrolled_${index}`}
            checked={education.currentlyEnrolled}
            onChange={(e) => handleCurrentlyEnrolledChange(e, index)}
            className="mr-2"
          />
          <label
            htmlFor={`currentlyEnrolled_${index}`}
            className="text-sm text-gray-700"
          >
            Currently Enrolled
          </label>
          <div className="mb-4"></div>
          <div className="mb-4 flex space-x-4">
            <button
              className="text-white bg-blueColor hover:bg-blueColor focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 "
              onClick={() => removeFormItem("education", index)}
            >
              Delete this education
            </button>
            <button
              className="text-white bg-blueColor hover:bg-blueColor focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  next-button"
              onClick={handleAddEducation}
            >
              Add another education
            </button>
          </div>
        </div>
      </div>
    ));
  }

  function renderWorkExperienceForms() {
    return workExperienceForms.map((workExperience, index) => (
      <div key={index}>
        <div className="flex space-x-4 mb-4">
          <div className="flex-grow">
            <label
              htmlFor={`jobTitle_${index}`}
              className="block text-sm font-medium text-gray-700"
            >
              Job Title:
            </label>
            <input
              id={`jobTitle_${index}`}
              type="text"
              placeholder="Job Title"
              value={workExperience.JobTitle}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={(e) =>
                handleFormChange(e, index, "JobTitle", "workExperience")
              }
            />
          </div>
          <div className="flex-grow">
            <label
              htmlFor={`company_${index}`}
              className="block text-sm font-medium text-gray-700"
            >
              Company:
            </label>
            <input
              id={`company_${index}`}
              type="text"
              placeholder="Company"
              value={workExperience.Company}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={(e) =>
                handleFormChange(e, index, "Company", "workExperience")
              }
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex-grow">
            <label
              htmlFor={`fromDate_${index}`}
              className="block text-sm font-medium text-gray-700"
            >
              From Date:
            </label>
            <input
              id={`fromDate_${index}`}
              type="month"
              placeholder="From Date"
              value={workExperience.fromDatePart}
              onChange={(e) =>
                handleFormChange(e, index, "fromDatePart", "workExperience")
              }
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div className="flex-grow">
            <label
              htmlFor={`toDate_${index}`}
              className="block text-sm font-medium text-gray-700"
            >
              To Date:
            </label>
            <input
              id={`toDate_${index}`}
              type="month"
              value={workExperience.toDatePart}
              disabled={workExperience.currentlyWorkHere}
              onChange={(e) =>
                handleFormChange(e, index, "toDatePart", "workExperience")
              }
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div className="flex items-center"></div>
        </div>
        <div className="mb-4">
          <input
            id={`currentlyWorkHere_${index}`}
            type="checkbox"
            checked={workExperience.currentlyWorkHere}
            onChange={(e) => handleCurrentlyWorkHereChange(e, index)}
            className="mr-2"
          />
          <label
            htmlFor={`currentlyWorkHere_${index}`}
            className="text-sm text-gray-700"
          >
            I Currently Work Here
          </label>
        </div>
        <div className="flex-grow">
          <label
            htmlFor={`description_${index}`}
            className="block text-sm font-medium text-gray-700"
          >
            Description:
          </label>
          <input
            id={`description_${index}`}
            type="text"
            placeholder="Description"
            value={workExperience.Description}
            onChange={(e) =>
              handleFormChange(e, index, "Description", "workExperience")
            }
            className="mb-4 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>
        <div className="mb-4 flex space-x-4">
          <button
            className="text-white bg-blueColor hover:bg-blueColor focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 "
            onClick={() => removeFormItem("workExperience", index)}
          >
            Delete this work experience
          </button>
          <button
            className="text-white bg-blueColor hover:bg-blueColor focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 "
            onClick={handleAddWorkExperience}
          >
            Add another work experience
          </button>
        </div>
      </div>
    ));
  }

  function renderCertificatesForms() {
    return certificatesForm.map((certificate, index) => (
      <div key={index}>
        <input
          type="text"
          placeholder="Certification Name"
          value={certificate.certification}
          onChange={(e) =>
            handleFormChange(e, index, "certification", "certificate")
          }
        />
        <input
          type="month"
          placeholder="Date Issued"
          value={certificate.DateIssued}
          onChange={(e) =>
            handleFormChange(e, index, "DateIssued", "certificate")
          }
        />
        <input
          type="text"
          placeholder="Description"
          value={certificate.description}
          onChange={(e) =>
            handleFormChange(e, index, "description", "certificate")
          }
        />
        <button onClick={() => removeFormItem("certificate", index)}>
          Delete
        </button>
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
      if (skillInput !== "") {
        setSkills((prevSkills) => [...prevSkills, skillInput]);
        event.target.value = "";
      }
    }
  }
  function removeFormItem(type, index) {
    if (type === "education") {
      setEducationForms((prevForms) => prevForms.filter((_, i) => i !== index));
    } else if (type === "workExperience") {
      setWorkExperienceForms((prevForms) =>
        prevForms.filter((_, i) => i !== index)
      );
    } else if (type === "certificate") {
      setCertificatesForm((prevForms) =>
        prevForms.filter((_, i) => i !== index)
      );
    }
  }

  function removeSkill(index) {
    setSkills((prevSkills) => prevSkills.filter((_, i) => i !== index));
  }

  function handleAddEducation() {
    setEducationForms((prevForms) => [
      ...prevForms,
      {
        level: "",
        fieldOfStudy: "",
        school: "",
        fromDate: "",
        toDate: "",
        currentlyEnrolled: false,
      },
    ]);
  }

  function handleAddWorkExperience() {
    setWorkExperienceForms((prevForms) => [
      ...prevForms,
      {
        jobTitle: "",
        company: "",
        fromDate: "",
        toDate: "",
        currentlyWorkHere: false,
        description: "",
      },
    ]);
  }

  function handleAddCertificate() {
    setCertificatesForm((prevForms) => [
      ...prevForms,
      {
        certification: "",
        DateIssued: "",
        description: "",
      },
    ]);
  }

  function handleCurrentlyEnrolledChange(event, index) {
    const isChecked = event.target.checked;
    setEducationForms((prevForms) => {
      const updatedForms = [...prevForms];
      updatedForms[index].currentlyEnrolled = isChecked;
      if (isChecked) {
        updatedForms[index].toDatePart = "Present";
      }
      return updatedForms;
    });
  }

  function handleCurrentlyWorkHereChange(event, index) {
    const isChecked = event.target.checked;
    setWorkExperienceForms((prevForms) => {
      const updatedForms = [...prevForms];
      updatedForms[index].currentlyWorkHere = isChecked;
      if (isChecked) {
        updatedForms[index].toDatePart = "Present";
      }
      return updatedForms;
    });
  }

  function handleFormChange(event, index, fieldName, formType) {
    const { value } = event.target;
    switch (formType) {
      case "education":
        setEducationForms((prevForms) => {
          const updatedForms = [...prevForms];
          updatedForms[index][fieldName] = value;
          return updatedForms;
        });
        break;
      case "workExperience":
        setWorkExperienceForms((prevForms) => {
          const updatedForms = [...prevForms];
          updatedForms[index][fieldName] = value;
          return updatedForms;
        });
        break;
      case "certificate":
        setCertificatesForm((prevForms) => {
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
      await fetch("http://localhost:9000/Candidate/cv/deleteEducation", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      // Delete existing work experience data
      await fetch("http://localhost:9000/Candidate/cv/deleteWorkExperience", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      // Delete existing certificate data
      await fetch("http://localhost:9000/Candidate/cv/deleteCertificate", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      // Now, update the CV data
      const cvData = {
        summary,
        skills: skills.join(";"), // Convert array to string
        searchable,
      };

      // Update CV on the server
      const updateResponse = await fetch(
        "http://localhost:9000/Candidate/cv/updateCV",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(cvData),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update CV");
      }

      // Now, add new education data
      for (const education of educationForms) {
        const educationData = {
          cvId,
          level: education.Level,
          fieldOfStudy: education.FieldOfStudy,
          school: education.School,
          TimePeriod: `${education.fromDatePart}_${education.toDatePart}`,
        };
        console.log("Posting education data:", educationData); // Logging education data

        // Add education on the server
        const addEducationResponse = await fetch(
          "http://localhost:9000/Candidate/cv/addEducation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(educationData),
          }
        );

        if (!addEducationResponse.ok) {
          throw new Error("Failed to add education");
        }
      }

      // Inside the submitCV function, after adding education
      for (const workExperience of workExperienceForms) {
        const workExperienceData = {
          cvId,
          jobTitle: workExperience.JobTitle,
          company: workExperience.Company,
          TimePeriod: `${workExperience.fromDatePart}_${workExperience.toDatePart}`,
          description: workExperience.Description,
        };
        console.log("Posting work experience data:", workExperienceData);

        // Add work experience on the server
        const addWorkExperienceResponse = await fetch(
          "http://localhost:9000/Candidate/cv/addWorkExperience",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(workExperienceData),
          }
        );

        if (!addWorkExperienceResponse.ok) {
          throw new Error("Failed to add work experience");
        }
      }
      // Inside the submitCV function, after adding work experience
      for (const certificate of certificatesForm) {
        const certificateData = {
          cvId,
          certification: certificate.certification,
          dateIssued: certificate.DateIssued,
          description: certificate.description,
        };
        console.log("Posting certificate data:", certificateData);

        // Add certificate on the server
        const addCertificateResponse = await fetch(
          "http://localhost:9000/Candidate/cv/addCertificate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(certificateData),
          }
        );

        if (!addCertificateResponse.ok) {
          throw new Error("Failed to add certificate");
        }
      }

      alert("CV submitted successfully");
    } catch (error) {
      console.error("Error submitting CV:", error);
      alert("Failed to submit CV. Please try again later.");
    }
  }

  return (
    <>
      <Navbar></Navbar>
      <div>
        {/* <h2>Candidate Resume</h2>
        <div id="candidateInfo">
          <p>
            <strong>First Name:</strong> {candidateInfo.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {candidateInfo.lastName}
          </p>
          <p>
            <strong>Phone:</strong> {candidateInfo.phone}
          </p>
          <p>
            <strong>Address:</strong> {candidateInfo.address}
          </p>
          <p>
            <strong>State:</strong> {candidateInfo.state}
          </p>
          <p>
            <strong>Country:</strong> {candidateInfo.country}
          </p>
        </div> */}
        <div className="mt-10 max-w-4xl mx-auto add-job-image">
          <h2 className="text-center text-xl font-bold">Build your resume:</h2>
          <div>
            <label
              htmlFor="summary"
              className="block mb-2 text-lg font-bold text-blueColor"
            >
              Summary:
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={handleChangeSummary}
              className="mb-7 block p-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 h-32"
            ></textarea>
          </div>

          <fieldset>
            <label
              htmlFor="Education"
              className="block mb-2 text-lg font-bold text-blueColor"
            >
              Education:
            </label>
            {renderEducationForms()}
          </fieldset>

          <fieldset>
            <label
              htmlFor="Work Experience"
              className="block mb-2 text-lg font-bold text-blueColor"
            >
              Work Experience:
            </label>
            {renderWorkExperienceForms()}
          </fieldset>

          <fieldset>
            <div className="mb-2">
              <label
                htmlFor="Skills"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Skills:
              </label>
              <input
                type="text"
                id="Skills"
                value={newSkill}
                onChange={handleChange}
                onKeyDown={addSkill}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter skills and press Enter"
              />
            </div>
            <ul className="flex flex-wrap mt-2">
              {skills.map((skill, index) => (
                <li
                  key={index}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full m-1 flex items-center"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="ml-2 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.42-9.88l2.12-2.12a1 1 0 011.42 1.42l-2.12 2.12 2.12 2.12a1 1 0 01-1.42 1.42L10 11.42l-2.12 2.12a1 1 0 01-1.42-1.42l2.12-2.12-2.12-2.12a1 1 0 011.42-1.42l2.12 2.12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>

          <fieldset>
            <legend>Certificates</legend>
            {renderCertificatesForms()}
            <button onClick={handleAddCertificate}>Add Certificates</button>
          </fieldset>

          <div>
            <label htmlFor="searchable">Searchable:</label>
            <input
              type="checkbox"
              id="searchable"
              checked={searchable}
              onChange={handleChangeSearchable}
            />
          </div>

          <div>
            <button type="submit" onClick={submitCV}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CV;
