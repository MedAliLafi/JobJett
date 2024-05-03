import { useState, useEffect } from "react";
import Navbar from "../NavBar/CandidateNavbar.jsx";

function CV() {
  const [candidateInfo, setCandidateInfo] = useState({});
  const [educationForms, setEducationForms] = useState([]);
  const [workExperienceForms, setWorkExperienceForms] = useState([]);
  const [certificatesForm, setCertificatesForm] = useState([]);
  const [domain, setDomain] = useState("");
  const [summary, setSummary] = useState("");
  const [searchable, setSearchable] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSoftSkill, setNewSoftSkill] = useState("");
  const [softskills, setSoftSkills] = useState([]);
  const [cvId, setCVId] = useState("");
  const [newJob, setNewJob] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showList, setShowList] = useState(false);
  const handleChange1 = (event) => {
    setNewSkill(event.target.value);
  };
  const handleChange2 = (event) => {
    setNewSoftSkill(event.target.value);
  };

  let jobs = [
    "Software Developer",
    "Data Scientist",
    "Cybersecurity Analyst",
    "Registered Nurse (RN)",
    "Occupational Therapist",
    "Physical Therapist",
    "Physician Assistant",
    "Nurse Practitioner",
    "Medical and Health Services Manager",
    "Artificial Intelligence (AI) Engineer",
    "Cloud Architect",
    "DevOps Engineer",
    "Product Manager",
    "UX/UI Designer",
    "Digital Marketing Specialist",
    "Financial Analyst",
    "Management Consultant",
    "Human Resources Manager",
    "Sales Manager",
    "Accountant",
    "Web Developer",
    "Mobile App Developer",
    "Information Security Analyst",
    "Network Engineer",
    "Systems Analyst",
    "Marketing Manager",
    "Operations Manager",
    "Supply Chain Manager",
    "Project Manager",
    "Civil Engineer",
    "Mechanical Engineer",
    "Electrical Engineer",
    "Chemical Engineer",
    "Environmental Engineer",
    "Biomedical Engineer",
    "Aerospace Engineer",
    "Industrial Engineer",
    "Quality Assurance Engineer",
    "Software Quality Assurance (QA) Engineer",
    "Data Engineer",
    "Machine Learning Engineer",
    "Business Intelligence Analyst",
    "Statistician",
    "Actuary",
    "Pharmacist",
    "Dental Hygienist",
    "Veterinarian",
    "Optometrist",
    "Dental Assistant",
    "Pharmacy Technician",
    "Medical Laboratory Technician",
    "Radiologic Technologist",
    "Physical Therapy Assistant",
    "Occupational Therapy Assistant",
    "Speech-Language Pathologist",
    "Computer Systems Administrator",
    "Database Administrator",
    "IT Support Specialist",
    "Technical Writer",
    "Content Writer",
    "Social Media Manager",
    "Customer Success Manager",
    "Logistics Coordinator",
    "Supply Chain Analyst",
    "Operations Research Analyst",
    "Risk Analyst",
    "Compliance Officer",
    "Legal Assistant",
    "Paralegal",
    "Executive Assistant",
    "Administrative Assistant",
    "Receptionist",
    "Customer Service Representative",
    "Retail Sales Associate",
    "Real Estate Agent",
    "Property Manager",
    "Construction Manager",
    "Architect",
    "Interior Designer",
    "Graphic Designer",
    "Illustrator",
    "Animator",
    "Video Editor",
    "Film Director",
    "Photographer",
    "Event Planner",
    "Wedding Planner",
    "Chef",
    "Restaurant Manager",
    "Bartender",
    "Waiter/Waitress",
    "Housekeeping Supervisor",
    "Janitor",
    "Landscape Architect",
    "Horticulturist",
    "Personal Trainer",
    "Yoga Instructor",
    "Fitness Coach",
    "Nutritionist",
    "Life Coach",
  ];

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
          setDomain(cvData.Domain);
          setSummary(cvData.Summary);
          setSearchable(cvData.Searchable === "true");
          setSkills(cvData.Skills.split(";code;"));
          setSoftSkills(cvData.SoftSkills.split(";code;"));
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

  const filterfct = (e) => {
    const input = e.target.value.toLowerCase();
    setNewJob(input);
    const filtered = jobs.filter((job) => job.toLowerCase().includes(input));
    setFilteredJobs(filtered);
    setShowList(true);
    setDomain(input);
  };

  const handleJobClick = (job) => {
    setNewJob(job);
    setShowList(false);
    setDomain(job);
  };

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

          <div className="mt-3 flex items-center mb-5">
            <input
              type="checkbox"
              id={`currentlyEnrolled_${index}`}
              checked={education.currentlyEnrolled}
              onChange={(e) => handleCurrentlyEnrolledChange(e, index)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={`currentlyEnrolled_${index}`}
              className="ms-2 text-sm font-medium text-gray-500 "
            >
              Currently Enrolled
            </label>
          </div>
          <div className="mb-4"></div>
          <div className="mb-4 flex space-x-4">
            <button
              className="text-white bg-blueColor hover:bg-blueColor focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 "
              onClick={() => removeFormItem("education", index)}
            >
              Delete this education
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
        </div>

        <div className="mt-3 flex items-center mb-5">
          <input
            id={`currentlyWorkHere_${index}`}
            type="checkbox"
            checked={workExperience.currentlyWorkHere}
            onChange={(e) => handleCurrentlyWorkHereChange(e, index)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor={`currentlyWorkHere_${index}`}
            className="ms-2 text-sm font-medium text-gray-500 "
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
          {/* <button
            className="text-white bg-blueColor hover:bg-blueColor focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 "
            onClick={handleAddWorkExperience}
          >
            Add another work experience
          </button> */}
        </div>
      </div>
    ));
  }

  function renderCertificatesForms() {
    return certificatesForm.map((certificate, index) => (
      <div key={index}>
        <div className="flex space-x-4 mb-4">
          <div className="flex-grow">
            <label
              htmlFor={`certificate${index}`}
              className="block text-sm font-medium text-gray-700"
            >
              Certificate's name:
            </label>
            <input
              type="text"
              placeholder="Certification Name"
              id={`certificate${index}`}
              value={certificate.certification}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={(e) =>
                handleFormChange(e, index, "certification", "certificate")
              }
            />
          </div>
          <div className="flex-grow">
            <label
              htmlFor={`certificate${index}`}
              className="block text-sm font-medium text-gray-700"
            >
              Date:
            </label>
            <input
              type="month"
              placeholder="Date Issued"
              value={certificate.DateIssued}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={(e) =>
                handleFormChange(e, index, "DateIssued", "certificate")
              }
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="Certificate-description"
            className="block text-sm font-medium text-gray-700"
          >
            Certificate's description:
          </label>
          <input
            type="text"
            id="Certificate-description"
            placeholder="Description"
            value={certificate.description}
            className="mb-4 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            onChange={(e) =>
              handleFormChange(e, index, "description", "certificate")
            }
          />
        </div>
        <button
          className="mb-5 text-white bg-blueColor hover:bg-blueColor focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 "
          onClick={() => removeFormItem("certificate", index)}
        >
          Delete this Certificate
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
      setNewSkill("");

      if (skillInput !== "") {
        setSkills((prevSkills) => [...prevSkills, skillInput]);
        event.target.value = "";
      }
    }
  }

  function addSoftSkill(event) {
    if (event.keyCode === 13) {
      const softskillInput = event.target.value.trim();
      setNewSoftSkill("");

      if (softskillInput !== "") {
        setSoftSkills((prevSoftSkills) => [...prevSoftSkills, softskillInput]);
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

  function removeSoftSkill(index) {
    setSoftSkills((prevSoftSkills) => prevSoftSkills.filter((_, i) => i !== index));
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
        domain,
        summary,
        skills: skills.join(";code;"),
        softskills: softskills.join(";code;"),
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
          <div className="mb-5">
          <label
            htmlFor="Domain"
            className="block mb-2 text-lg font-bold text-blueColor "
            >
            Domain:
          </label>
          <input
            type="text"
            name="Domain"
            id="Domain"
            list="jobName"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter your domain"
            required
            autoComplete="off"
            value={newJob}
            onChange={filterfct}
          />
          {showList && ( // Only render the list if showList is true
            <div className="result-box text-sm">
              <ul>
                {filteredJobs.map((job, index) => (
                  <li
                    key={index}
                    onClick={() => handleJobClick(job)} // Pass the clicked job to handleJobClick
                    className="text-gray-900 hover:bg-gray-100 "
                  >
                    {job}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
          <div>
            <label
              htmlFor="summary"
              className="block mb-2 text-lg font-bold text-blueColor "
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
              className="block mb-2 text-lg font-bold text-blueColor "
            >
              Education:
            </label>
            {renderEducationForms()}
            <div className="flex justify-center">
              <button
                className="text-gray-500 hover:underline hover:text-blueColor  "
                onClick={handleAddEducation}
              >
                Add an education
              </button>
            </div>
          </fieldset>

          <fieldset>
            <label
              htmlFor="Work Experience"
              className="block mb-2 text-lg font-bold text-blueColor"
            >
              Work Experience:
            </label>
            {renderWorkExperienceForms()}
            <div className="flex justify-center">
              <button
                className=" text-gray-500 hover:underline hover:text-blueColor  "
                onClick={handleAddWorkExperience}
              >
                Add a work experience
              </button>
            </div>
          </fieldset>

          <fieldset>
            <div className="mb-2">
              <label
                htmlFor="Skills"
                className="block mb-2 text-lg font-bold text-blueColor"
              >
                Skills:
              </label>
              <input
                type="text"
                id="Skills"
                value={newSkill}
                onChange={handleChange1}
                onKeyDown={addSkill}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter skills and press Enter"
              />
            </div>
            <ul className="mb-5 flex flex-wrap mt-2">
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
            <div className="mb-2">
              <label
                htmlFor="SoftSkills"
                className="block mb-2 text-lg font-bold text-blueColor"
              >
                Soft Skills:
              </label>
              <input
                type="text"
                id="SoftSkills"
                value={newSoftSkill}
                onChange={handleChange2}
                onKeyDown={addSoftSkill}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter soft skills and press Enter"
              />
            </div>
            <ul className="mb-5 flex flex-wrap mt-2">
              {softskills.map((softskill, index) => (
                <li
                  key={index}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full m-1 flex items-center"
                >
                  {softskill}
                  <button
                    type="button"
                    onClick={() => removeSoftSkill(index)}
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
            <label
              htmlFor="certificates"
              className="block mb-2 text-lg font-bold text-blueColor"
            >
              Certificates:
            </label>
            {renderCertificatesForms()}
            <div className="flex justify-center">
              <button
                className=" text-gray-500 hover:underline hover:text-blueColor  "
                onClick={handleAddCertificate}
              >
                Add Certificates
              </button>
            </div>
          </fieldset>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="searchable"
              checked={searchable}
              onChange={handleChangeSearchable}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />

            <label
              htmlFor="searchable"
              className="ms-2 text-sm font-medium text-gray-600"
            >
              Searchable
            </label>
          </div>
          <div>
            <button
              className="text-white bg-blueColor hover:bg-blueColor focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-2xl text-sm px-7 py-3.5  w-full mt-4 mb-10"
              type="submit"
              onClick={submitCV}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CV;
