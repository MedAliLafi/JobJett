import "./AddJobOffer.css";
import image from "../../../assets/NA_October_10.jpg";
import { useState } from "react";

const AddJobOffer2 = ({ formData, setFormData }) => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [SoftSkills, setSoftSkills] = useState([]);
  const [newSoftSkill, setNewSoftSkill] = useState("");
  const [Questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [reqEducation, setReqEducation] = useState("");
  const [reqExperience, setReqExperience] = useState("");
  const [additionalQuestions, setAdditionalQuestions] = useState("No");

  const handleReqEducationChange = (e) => {
    const value = e.target.value;
    setReqEducation(value);
    setFormData(formData => ({
      ...formData,
      reqEducation: value,
    }));
  };

    const handleReqExperienceChange = (e) => {
    const value = e.target.value;
    setReqExperience(value);
    setFormData(formData => ({
      ...formData,
      reqExperience: value,
    }));
  };


  const handleChange = (e) => {
    setNewSkill(e.target.value);
  };
  const handleChange2 = (e) => {
    setNewSoftSkill(e.target.value);
  };
  const handleChange3 = (e) => {
    setNewQuestion(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && newSkill.trim() !== "") {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      const skillsText = skills.join(';');
      setFormData({ ...formData, reqSkills: skillsText });
    }
  };
  const handleKeyDown2 = (e) => {
    if (e.key === "Enter" && newSoftSkill.trim() !== "") {
      setSoftSkills([...SoftSkills, newSoftSkill.trim()]);
      setNewSoftSkill("");
      const softskillsText = SoftSkills.join(';');
      setFormData({ ...formData, reqSoftSkills: softskillsText });
    }
  };
  const handleKeyDown3 = (e) => {
    if (e.key === "Enter" && newQuestion.trim() !== "") {
      setQuestions([...Questions, newQuestion.trim()]);
      setNewQuestion("");
      const questionsText = Questions.join(';');
      setFormData({ ...formData, additionalQuestions: questionsText });
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };
  const handleRemoveSkill2 = (index) => {
    setSoftSkills(SoftSkills.filter((_, i) => i !== index));
  };
  const handleRemoveSkill3 = (index) => {
    setQuestions(Questions.filter((_, i) => i !== index));
  };

  const handleAdditionalQuestionsChange = (e) => {
    const value = e.target.value;
    setAdditionalQuestions(value);
    setFormData(formData => ({
      ...formData,
      additionalQuestions: value,
    }));
  };

  return (
    <div className="">
      <img src={image} className="max-w-xl mx-auto add-job-image" alt="Job" />
      <form className="max-w-xl mx-auto">
        <div className="mb-4 max max-w-xl mx-auto">
          <label
            htmlFor="yearsExperience"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Minimum education level required:
          </label>
          <select
            id="reqEducation"
            text="reqEducation"
            value={reqEducation}
            onChange={handleReqEducationChange}
            className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blueColor focus:border-blueColor block w-full  p-2.5 "
          >
            <option value="">Select the minimum education level required</option>
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
        </div>
        <div className="mb-4 max max-w-xl mx-auto">
          <label
            htmlFor="yearsExperience"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Select Years of Experience Required:
          </label>
          <select
            id="reqExperience"
            text="reqExperience"
            value={reqExperience}
            onChange={handleReqExperienceChange}
            className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blueColor focus:border-blueColor block w-full  p-2.5 "
          >
            <option value="">Select the minimum years of experience required</option>
            <option value="Less than 1 year">Less than 1 year</option>
            <option value="1-2 years">1-2 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="5-10 years">5-10 years</option>
            <option value="More than 10 years">More than 10 years</option>
          </select>
        </div>
        <div className="mb-2">
          <label
            htmlFor="Skills"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Required Skills:
          </label>
          <input
            type="text"
            id="reqSkills"
            text="reqSkills"
            value={newSkill}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter required skills and press Enter"
            required
          />
          <ul className="flex flex-wrap mt-2">
            {skills.map((skill, index) => (
              <li
                key={index}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full m-1 flex items-center"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
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
        </div>
        <div className="mb-4">
          <label
            htmlFor="SoftSkills"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Required Soft Skills:
          </label>
          <input
            type="text"
            id="reqSoftSkills"
            text="reqSoftSkills"
            value={newSoftSkill}
            onChange={handleChange2}
            onKeyDown={handleKeyDown2}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter required skills and press Enter"
            required
          />
          <ul className="flex flex-wrap mt-2">
            {SoftSkills.map((SoftSkills, index) => (
              <li
                key={index}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full m-1 flex items-center"
              >
                {SoftSkills}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill2(index)}
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
        </div>
        <div className="mb-4">
          <label
            htmlFor="additionalQuestions"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Additional Questions:
          </label>
          <div>
            <label>
              <input
                type="radio"
                value="Yes"
                checked={additionalQuestions === "Yes"}
                onChange={handleAdditionalQuestionsChange}
              />
              Yes
            </label>
            <label className="ml-4">
              <input
                type="radio"
                value="No"
                checked={additionalQuestions === "No"}
                onChange={handleAdditionalQuestionsChange}
              />
              No
            </label>
          </div>
        </div>
        {additionalQuestions === "Yes" && (
          <div className="mb-4">
            <label
              htmlFor="additionalQuestionsInput"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
Enter your additional questions:            </label>
            <input
              type="text"
              id="additionalQuestionsInput"
              text="additionalQuestionsInput"
              value={newQuestion}
              onChange={handleChange3}
              onKeyDown={handleKeyDown3}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter your additional questions"
              required
            />
          <ul className="flex flex-wrap mt-2">
            {Questions.map((question, index) => (
              <li
                key={index}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full m-1 flex items-center"
              >
                {question}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill3(index)}
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
          </div>
        )}
      </form>
    </div>
  );
};

export default AddJobOffer2;
