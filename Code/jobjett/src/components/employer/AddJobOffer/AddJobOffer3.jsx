import "./AddJobOffer.css";
import image from "../../../assets/NA_October_10.jpg";
import { useState } from "react";
const AddJobOffer3 = ({ formData, setFormData }) => {
  const [salary, setSalary] = useState("Exact");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [payFrequency, setPayFrequency] = useState("");
  const [jobLocationType, setJobLocationType] = useState("");

  const handleSalaryAmountChange = (e) => {
    const value = e.target.value;
    setFormData((formData) => ({
      ...formData,
      pay: value,
    }));
  };

  const handleMinSalaryChange = (e) => {
    const value = e.target.value;
    setMinSalary(value);
    setFormData((formData) => ({
      ...formData,
      pay: `${value}-${maxSalary}`,
    }));
  };

  const handleMaxSalaryChange = (e) => {
    const value = e.target.value;
    setMaxSalary(value);
    setFormData((formData) => ({
      ...formData,
      pay: `${minSalary}-${value}`,
    }));
  };

  const handlePayTypeChange = (e) => {
    const value = e.target.value;
    setSalary(value);
    setMinSalary("");
    setMaxSalary("");
    setFormData((formData) => ({
      ...formData,
      payType: value,
    }));
  };

  const handleJobLocationTypeChange = (e) => {
    const value = e.target.value;
    setJobLocationType(value);
    setFormData((formData) => ({
      ...formData,
      jobLocationType: value,
    }));
  };

  const handlePayFrequencyChange = (e) => {
    const value = e.target.value;
    setPayFrequency(value);
    setFormData((formData) => ({
      ...formData,
      payFrequency: value,
    }));
  };

  return (
    <div className="">
      <img src={image} className=" max-w-xl mx-auto add-job-image"></img>
      <form className="max-w-xl mx-auto">
        <div className="mb-4">
          <h3 className="block mb-2 text-sm font-medium text-gray-900">
            Job type:
          </h3>
          <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex">
            <li className="w-full bg-gray-50 border border-gray-300 text-gray-900">
              <div className="flex items-center ps-3">
                <input
                  id="fullTime"
                  type="radio"
                  value="Full-time"
                  name="Job-Type"
                  className="w-4 h-4   "
                  onChange={(e) =>
                    setFormData({ ...formData, jobType: e.target.value })
                  }
                />
                <label
                  htmlFor="fullTime"
                  className="w-full py-3 ms-2 text-sm font-medium"
                >
                  Full-time
                </label>
              </div>
            </li>
            <li className="w-full bg-gray-50 border border-gray-300 text-gray-900">
              <div className="flex items-center ps-3">
                <input
                  name="Job-Type"
                  id="partTime"
                  type="radio"
                  value="Part-time"
                  className="w-4 h-4"
                  onChange={(e) =>
                    setFormData({ ...formData, jobType: e.target.value })
                  }
                />
                <label
                  htmlFor="partTime"
                  className="w-full py-3 ms-2 text-sm font-medium"
                >
                  Part-time
                </label>
              </div>
            </li>
            <li className="w-full bg-gray-50 border border-gray-300 text-gray-900">
              <div className="flex items-center ps-3">
                <input
                  id="temporary"
                  type="radio"
                  name="Job-Type"
                  value="Temporary"
                  className="w-4 h-4"
                  onChange={(e) =>
                    setFormData({ ...formData, jobType: e.target.value })
                  }
                />
                <label
                  htmlFor="temporary"
                  className="w-full py-3 ms-2 text-sm font-medium"
                >
                  Temporary
                </label>
              </div>
            </li>
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="block mb-2 text-sm font-medium text-gray-900">
            Schedule:
          </h3>
          <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex">
            <li className="w-full bg-gray-50 border border-gray-300 text-gray-900">
              <div className="flex items-center ps-3">
                <input
                  name="Schedule"
                  id="fourHourShift"
                  type="radio"
                  value="4 hour shift"
                  className="w-4 h-4"
                  onChange={(e) =>
                    setFormData({ ...formData, jobSchedule: e.target.value })
                  }
                />
                <label
                  htmlFor="fourHourShift"
                  className="w-full py-3 ms-2 text-sm font-medium"
                >
                  4 hour shift
                </label>
              </div>
            </li>
            <li className="w-full bg-gray-50 border border-gray-300 text-gray-900">
              <div className="flex items-center ps-3">
                <input
                  id="eightHourShift"
                  type="radio"
                  name="Schedule"
                  value="8 hour shift"
                  className="w-4 h-4"
                  onChange={(e) =>
                    setFormData({ ...formData, jobSchedule: e.target.value })
                  }
                />
                <label
                  htmlFor="eightHourShift"
                  className="w-full py-3 ms-2 text-sm font-medium"
                >
                  8 hour shift
                </label>
              </div>
            </li>
            <li className="w-full bg-gray-50 border border-gray-300 text-gray-900">
              <div className="flex items-center ps-3">
                <input
                  id="tenHourShift"
                  type="radio"
                  name="Schedule"
                  value="10 hour shift"
                  className="w-4 h-4"
                  onChange={(e) =>
                    setFormData({ ...formData, jobSchedule: e.target.value })
                  }
                />
                <label
                  htmlFor="tenHourShift"
                  className="w-full py-3 ms-2 text-sm font-medium"
                >
                  10 hour shift
                </label>
              </div>
            </li>
          </ul>
        </div>
        <div className="max-w-xl mb-4 max max-w-sm mx-auto">
          <label
            htmlFor="jobLocationType"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Job location type:
          </label>
          <select
            id="jobLocationType"
            name="jobLocationType"
            value={jobLocationType}
            onChange={handleJobLocationTypeChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Select the job location type</option>
            <option value="In-person, precise location">
              In-person, precise location
            </option>
            <option value="In-person, within a limited area">
              In-person, within a limited area
            </option>
            <option value="Fully remote: no on-site work required">
              Fully remote: no on-site work required
            </option>
            <option value="Hybrid: some on-site work required">
              Hybrid: some on-site work required
            </option>
            <option value="On the road">On the road</option>
          </select>
        </div>
        {/* Salary Type */}
        <div className="mb-4 max-w-xl max-w-sm mx-auto">
          <label
            htmlFor="payType"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Salary Type:
          </label>
          <select
            id="payType"
            text="payType"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={salary}
            onChange={handlePayTypeChange}
          >
            <option value="">Select the amount type</option>
            <option value="Range">Range</option>
            <option value="Start">Starting amount</option>
            <option value="Max">Maximum amount</option>
            <option value="Exact">Exact amount</option>
          </select>
        </div>

        {/* Pay Frequency field */}
        <div className="mb-4 max-w-xl max-w-sm mx-auto">
          <label
            htmlFor="payFrequency"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Pay Frequency:
          </label>
          <select
            id="payFrequency"
            name="payFrequency"
            value={payFrequency}
            onChange={handlePayFrequencyChange}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Select Pay Frequency</option>
            <option value="per year">per year</option>
            <option value="per month">per month</option>
            <option value="per week">per week</option>
            <option value="per day">per day</option>
            <option value="per hour">per hour</option>
          </select>
        </div>

        {/* Salary Input fields */}
        {salary === "Range" && (
          <div className="mb-4 max-w-xl max-w-sm mx-auto flex justify-around items-baseline">
            <label
              htmlFor="MinSalaryRange"
              className="mb-2 text-base font-medium text-gray-900"
            >
              From
            </label>
            <input
              type="number"
              id="MinSalaryRange"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-50 p-2.5"
              placeholder="Enter minimum salary"
              value={minSalary}
              onChange={handleMinSalaryChange}
              required
            />
            <label
              htmlFor="MaxSalaryRange"
              className="mb-2 text-base font-medium text-gray-900"
            >
              To
            </label>
            <input
              type="number"
              id="MaxSalaryRange"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-50 p-2.5"
              placeholder="Enter maximum salary"
              value={maxSalary}
              onChange={handleMaxSalaryChange}
              required
            />
          </div>
        )}

        {/* Other salary input fields */}
        {salary !== "Range" && (
          <div className="mb-4 max-w-xl mx-auto">
            <label
              htmlFor={salary}
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              {salary === "Start"
                ? "Starting amount"
                : salary === "Max"
                ? "Maximum amount"
                : "Exact amount"}
              :
            </label>
            <input
              type="number"
              id={salary}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder={`Enter ${salary.toLowerCase()}`}
              required
              onChange={handleSalaryAmountChange}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default AddJobOffer3;
