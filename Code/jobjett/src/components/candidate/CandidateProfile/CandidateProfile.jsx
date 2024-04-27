import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavBar/CandidateNavbar.jsx";

const CandidateProfile = () => {
  const navigate = useNavigate();
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [DOB, setDOB] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    fetchCandidateInfo();
  }, []);

  useEffect(() => {
    if (candidateInfo) {
      setFirstName(candidateInfo.firstName);
      setLastName(candidateInfo.lastName);
      setEmail(candidateInfo.email);
      let DD = candidateInfo.dateOfBirth.slice(0, 2);
      let MM = candidateInfo.dateOfBirth.slice(3, 5);
      let YY = candidateInfo.dateOfBirth.slice(6, 10);
      setDOB(YY + "-" + MM + "-" + DD);
      setPhone(candidateInfo.phone);
      setAddress(candidateInfo.address);
      setState(candidateInfo.state);
      setCountry(candidateInfo.country);
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

  const handleChangePassword = () => {
    navigate('/candidate/profile/changepassword');
  };

  const handleChangeEmail = () => {
      navigate('/candidate/profile/changeemail');
  };

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

  const handleEditProfile = () => {
    setEditMode(true);
  };
  const handleSaveProfile = async () => {
    try {
      const response = await fetch(
        "http://localhost:9000/Candidate/updateProfile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            firstName: FirstName,
            lastName: LastName,
            email: email,
            dateOfBirth: DOB,
            phone: phone,
            address: address,
            state: state,
            country: country,
          }),
        }
      );
      if (response.ok) {
        console.log("Profile updated successfully");
        setEditMode(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
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

                {editMode ? (
                  <input
                    id="FirstName"
                    type="text"
                    placeholder="First Name"
                    value={FirstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                ) : (
                  <input
                    id="FirstName"
                    type="text"
                    placeholder="First Name"
                    value={FirstName}
                    disabled
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                )}
              </div>
              <div className="flex-grow">
                <label
                  htmlFor="LastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name:
                </label>
                {editMode ? (
                  <input
                    id="LastName"
                    type="text"
                    placeholder="Last Name"
                    value={LastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                ) : (
                  <input
                    id="LastName"
                    type="text"
                    placeholder="Last Name"
                    value={LastName}
                    disabled
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                )}
              </div>
            </div>
            <div className="flex-grow">
              <label
                htmlFor="Email"
                className="block text-sm font-medium text-gray-700"
              >
                Email:
              </label>
              {editMode ? (
                <input
                  id="Email"
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              ) : (
                <input
                  id="Email"
                  type="text"
                  placeholder="Email"
                  value={email}
                  disabled
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              )}
            </div>
            <div className="flex-grow">
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth:
              </label>
              {editMode ? (
                <input
                  id="dob"
                  type="date"
                  placeholder="Date of Birth"
                  value={DOB}
                  onChange={(e) => setDOB(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              ) : (
                <input
                  id="dob"
                  type="date"
                  placeholder="Date of Birth"
                  value={DOB}
                  disabled
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              )}
            </div>
            <div className="flex-grow">
              <label
                htmlFor="tel"
                className="block text-sm font-medium text-gray-700"
              >
                Phone:
              </label>
              {editMode ? (
                <input
                  id="tel"
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              ) : (
                <input
                  id="tel"
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  disabled
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              )}
            </div>
            <div className="flex-grow">
              <label
                htmlFor="Address"
                className="block text-sm font-medium text-gray-700"
              >
                Address:
              </label>
              {editMode ? (
                <input
                  id="Address"
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              ) : (
                <input
                  id="Address"
                  type="text"
                  placeholder="Address"
                  value={address}
                  disabled
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              )}
            </div>
            <div className="flex-grow">
              <label
                htmlFor="State"
                className="block text-sm font-medium text-gray-700"
              >
                State:
              </label>
              {editMode ? (
                <input
                  id="State"
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              ) : (
                <input
                  id="State"
                  type="text"
                  placeholder="State"
                  value={state}
                  disabled
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              )}
            </div>
            <div className="flex-grow">
              <label
                htmlFor="Country"
                className="block text-sm font-medium text-gray-700"
              >
                Country:
              </label>
              {editMode ? (
                <input
                  id="Country"
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              ) : (
                <input
                  id="Country"
                  type="text"
                  placeholder="Country"
                  value={country}
                  disabled
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              )}
            </div>
            <button
              className="btn"
              onClick={editMode ? handleSaveProfile : handleEditProfile}
            >
              {editMode ? "Save Profile" : "Edit Profile"}
            </button>
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