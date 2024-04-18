import "./AddJobOffer.css";
import image from "../../../assets/NA_October_10.jpg";
import { useState } from "react";

const AddJobOffer1 = ({ formData, setFormData }) => {
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
  const [newJob, setNewJob] = useState("");
  const [jobDepartment, setJobDepartment] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [showList, setShowList] = useState(false);

  const filterfct = (e) => {
    const input = e.target.value.toLowerCase();
    setNewJob(input);
    const filtered = jobs.filter((job) => job.toLowerCase().includes(input));
    setFilteredJobs(filtered);
    setShowList(true);
    setFormData(formData => ({
      ...formData,
      jobTitle: input,
    }));
  };

  const handleJobClick = (job) => {
    setNewJob(job);
    setShowList(false);
    setFormData(formData => ({
      ...formData,
      jobTitle: job
    }));
  };

  const handleJobDepartmentChange = (e) => {
    const value = e.target.value;
    setJobDepartment(value);
    setFormData(formData => ({
      ...formData,
      jobDepartment: value,
    }));
  };

  const handleJobDescriptionChange = (e) => {
    const value = e.target.value;
    setJobDescription(value);
    setFormData(formData => ({
      ...formData,
      jobDescription: value,
    }));
  };

  return (
    <div className="site">
      <img
        src={image}
        className="max-w-xl mx-auto add-job-image"
        alt="job"
      ></img>
      <form className="max-w-xl mx-auto">
        <div className="mb-5">
          <label
            htmlFor="Job-title"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Job title:
          </label>
          <input
            type="text"
            name="jobTitle"
            id="JobTitle"
            list="jobName"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter job title"
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

        <div className="max max-w-xl mx-auto">
          <label
            htmlFor="jobDepartment"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Select a Job Department:
          </label>
          <select
            value={jobDepartment}
            onChange={handleJobDepartmentChange}
            required
            name="jobDepartment"
            id="jobDepartment"
            text="jobDepartment"
            className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blueColor focus:border-blueColor block w-full  p-2.5 "
          >
            <option value="">Select a job department</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Customer Service">Customer Service</option>
            <option value="Information Technology">
              Information Technology
            </option>
            <option value="Operations">Operations</option>
            <option value="Research and Development">
              Research and Development
            </option>
            <option value="Production/Manufacturing">
              Production/Manufacturing
            </option>
            <option value="Supply Chain/Logistics">
              Supply Chain/Logistics
            </option>
            <option value="Quality Assurance/Quality Control">
              Quality Assurance/Quality Control
            </option>
            <option value="Legal">Legal</option>
            <option value="Public Relations">Public Relations</option>
            <option value="Administration">Administration</option>
            <option value="Health and Safety">Health and Safety</option>
            <option value="Training and Development">
              Training and Development
            </option>
            <option value="Corporate Strategy">Corporate Strategy</option>
            <option value="Internal Audit">Internal Audit</option>
            <option value="Risk Management">Risk Management</option>
            <option value="Environmental Sustainability">
              Environmental Sustainability
            </option>
          </select>
        </div>
        <div>
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Job Description:
          </label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            rows="4"
            className="mb-7 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write the job details..."
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            required
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default AddJobOffer1;
