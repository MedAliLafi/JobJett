import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavBar/CandidateNavbar.jsx";

const CandidateProfile = () => {
  const navigate = useNavigate();
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [FirstName, setFirstName] = useState(""); // Moved inside the component
  const [LastName, setLastName] = useState(""); // Moved inside the component
  const [email, setEmail] = useState("");
  const [DOB, setDOB] = useState("");
  const [phone, setphone] = useState("");
  const [address, setadress] = useState("");
  const [state, setState] = useState("");
  const [country, setcountry] = useState("");
  var dateOfBirth;
  useEffect(() => {
    fetchCandidateInfo();
  }, []);
  useEffect(() => {
    if (candidateInfo) {
      setFirstName(candidateInfo.firstName); // Set FirstName when candidateInfo is updated
      setLastName(candidateInfo.lastName);
      setEmail(candidateInfo.email);
      let DD = candidateInfo.dateOfBirth.slice(0, 2);
      let MM = candidateInfo.dateOfBirth.slice(3, 5);
      let YY = candidateInfo.dateOfBirth.slice(6, 10);
      setDOB(YY + "-" + MM + "-" + DD);
      setphone(candidateInfo.phone);
      setphone(candidateInfo.phone);
      setadress(candidateInfo.address);
      setState(candidateInfo.state);
      setcountry(candidateInfo.country);
    }
  }, [candidateInfo]);

  const fetchCandidateInfo = async () => {
    try {
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
      if (response.ok) {
        const data = await response.json();
        data.dateOfBirth = new Date(data.dateOfBirth).toLocaleDateString(
          "en-GB"
        );
        setCandidateInfo(data);
      } else {
        console.error("Failed to fetch candidate information");
      }
    } catch (error) {
      console.error("Error fetching candidate information:", error);
    }
  };

  const handleViewApplications = () => {
    navigate("/candidate/applications");
  };

  const handleManageCV = () => {
    navigate("/candidate/cv");
  };

  const handleChangePassword = () => {};

  const handleChangeEmail = () => {};

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("http://localhost:9000/User/deleteUser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        logout();
      } else {
        console.error("Account deletion failed");
      }
    } catch (error) {
      console.error("Error during account deletion:", error);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:9000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        console.error("Logout failed");
      }
      navigate("/candidate/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }
  const handlastNameChange = (e) => {
    setLastName(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleDOBChange = (e) => {
    setDOB(e.target.value);
  };
  const handlePhoneChange = (e) => {
    setphonee(e.target.value);
  };
  const handleadressChange = (e) => {
    setadress(e.target.value);
  };
  const handleStateChange = (e) => {
    setState(e.target.value);
  };
  const handleCountryChange = (e) => {
    setcountry(e.target.value);
  };
  return (
    <>
      <Navbar></Navbar>
      <div className="mt-10 max-w-3xl mx-auto text-center">
        <h2>Candidate Profile</h2>
        {candidateInfo && (
          <div>
            <div className="flex space-x-4">
              <div className="flex-grow">
                <label
                  htmlFor="FirstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name:
                </label>
                <input
                  id="FirstName"
                  type="text"
                  placeholder="From Date"
                  value={FirstName}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  onChange={handleFirstNameChange}
                />
              </div>
              <div className="flex-grow">
                <label
                  htmlFor="LastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name:
                </label>
                <input
                  id="LastName"
                  type="text"
                  placeholder="From Date"
                  value={LastName}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  onChange={handlastNameChange}
                />
              </div>
            </div>
            <div className="flex-grow">
              <label
                htmlFor="Email"
                className="block text-sm font-medium text-gray-700"
              >
                Email:
              </label>
              <input
                id="Email"
                type="text"
                placeholder="From Date"
                value={email}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={handleEmailChange}
              />
            </div>
            <div className="flex-grow">
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700"
              >
                Date of birth:
              </label>
              <input
                id="dob"
                type="date"
                placeholder="From Date"
                value={DOB}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={handleDOBChange}
              />
            </div>
            <div className="flex-grow">
              <label
                htmlFor="Email"
                className="block text-sm font-medium text-gray-700"
              >
                Tel:
              </label>
              <input
                id="tel"
                type="tel"
                placeholder="From Date"
                value={phone}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={handlePhoneChange}
              />
            </div>
            <div className="flex-grow">
              <label
                htmlFor="Email"
                className="block text-sm font-medium text-gray-700"
              >
                Address:
              </label>
              <input
                id="Email"
                type="email"
                placeholder="From Date"
                value={address}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={handleadressChange}
              />
            </div>
            <div className="flex-grow">
              <label
                htmlFor="State"
                className="block text-sm font-medium text-gray-700"
              >
                State:
              </label>
              <input
                id="State"
                type="text"
                placeholder="From Date"
                value={state}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={handleStateChange}
              />
            </div>
            <div className="flex-grow">
              <label
                htmlFor="Country"
                className="block text-sm font-medium text-gray-700"
              >
                Country:
              </label>
              <input
                id="Country"
                type="text"
                placeholder="From Date"
                value={country}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={handleCountryChange}
              />
            </div>

            <p>
              <strong>First Name:</strong> {candidateInfo.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {candidateInfo.lastName}
            </p>
            <p>
              <strong>Email:</strong> {candidateInfo.email}
            </p>
            <p>
              <strong>Date of birth:</strong> {candidateInfo.dateOfBirth}
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
          </div>
        )}
        <h3>Actions</h3>
        <button className="btn" onClick={handleViewApplications}>
          Applications
        </button>
        <button className="btn" onClick={handleManageCV}>
          Manage CV
        </button>
        <button className="btn" onClick={handleChangePassword}>
          Change Password
        </button>
        <button className="btn" onClick={handleChangeEmail}>
          Change Email
        </button>
        <button className="btn" onClick={handleDeleteAccount}>
          Delete Account
        </button>
        <button className="btn" onClick={logout}>
          Logout
        </button>
      </div>
    </>
  );
};

export default CandidateProfile;
