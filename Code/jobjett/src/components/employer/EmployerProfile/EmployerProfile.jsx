import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../NavBar/EmployerNavbar.jsx";

const EmployerProfile = () => {
    const navigate = useNavigate();
    const [employerInfo, setEmployerInfo] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [industry, setIndustry] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");

    useEffect(() => {
        fetchEmployerInfo();
    }, []);

    useEffect(() => {
        if (employerInfo) {
            setCompanyName(employerInfo.companyName);
            setEmail(employerInfo.email);
            setIndustry(employerInfo.industry);
            setPhone(employerInfo.phone);
            setAddress(employerInfo.address);
            setState(employerInfo.state);
            setCountry(employerInfo.country);
        }
    }, [employerInfo]);

    const fetchEmployerInfo = async () => {
        try {
            const response = await fetch('http://localhost:9000/Employer/employerInfo', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setEmployerInfo(data);
            } else {
                console.error('Failed to fetch employer information');
            }
        } catch (error) {
            console.error('Error fetching employer information:', error);
        }
    };

    const handleViewApplications = () => {
        navigate('/employer/applications');
    };

    const handleAddJobOffer = () => {
        navigate('/employer/addjoboffer');
    };

    const handleChangePassword = () => {
        navigate('/employer/profile/changepassword');
    };

    const handleChangeEmail = () => {
        navigate('/employer/profile/changeemail');
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch('http://localhost:9000/User/deleteUser', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (response.ok) {
                logout();
                navigate('/employer/login');
            } else {
                console.error('Account deletion failed');
            }
        } catch (error) {
            console.error('Error during account deletion:', error);
        }
    };

    const logout = async () => {
        try {
            const response = await fetch('http://localhost:9000/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                console.error('Logout failed');
            }
            navigate('/employer/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const handleEditProfile = () => {
        setEditMode(true);
    };

    const handleSaveProfile = async () => {
        try {
            const response = await fetch(
                'http://localhost:9000/Employer/updateProfile',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        companyName: companyName,
                        email: email,
                        industry: industry,
                        phone: phone,
                        address: address,
                        state: state,
                        country: country
                    })
                }
            );
            if (response.ok) {
                console.log('Profile updated successfully');
                setEditMode(false);
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <>
            <Navbar></Navbar>
            <div className="mt-10 max-w-3xl mx-auto text-center">
                <h2>Employer Profile</h2>
                {employerInfo && (
                        <div>
                        <div className="flex-grow">
                            <label htmlFor="companyName"
                            className="block text-sm font-medium text-gray-700"
                            >Company Name:</label>
                            {editMode ? (
                                <input
                                    id="companyName"
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"

                                />
                            ) : (
                                <input
                                    id="companyName"
                                    type="text"
                                    value={companyName}
                                    disabled
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                />
                            )}
                        </div>
                        <div className="flex-grow">
                            <label htmlFor="email"
                                              className="block text-sm font-medium text-gray-700"
                                              >Email:</label>
                            {editMode ? (
                                <input
                                    id="email"
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"

                                />
                            ) : (
                                <input
                                    id="email"
                                    type="text"
                                    value={email}
                                    disabled
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"

                                />
                            )}
                        </div>
                        <div className="flex-grow">
                            <label htmlFor="industry"
                                              className="block text-sm font-medium text-gray-700"
                                              >Industry:</label>
                            {editMode ? (
                                <input
                                    id="industry"
                                    type="text"
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"

                                />
                            ) : (
                                <input
                                    id="industry"
                                    type="text"
                                    value={industry}
                                    disabled
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"

                                />
                            )}
                        </div>
                        <div className="flex-grow">
                            <label htmlFor="phone"
                                              className="block text-sm font-medium text-gray-700"
                                              >Phone:</label>
                            {editMode ? (
                                <input
                                    id="phone"
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"

                                />
                            ) : (
                                <input
                                    id="phone"
                                    type="text"
                                    value={phone}
                                    disabled
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"

                                />
                            )}
                        </div>
                        <div className="flex-grow">
                            <label htmlFor="address"
                                              className="block text-sm font-medium text-gray-700"
                                              >Address:</label>
                            {editMode ? (
                                <input
                                    id="address"
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"

                                />
                            ) : (
                                <input
                                    id="address"
                                    type="text"
                                    value={address}
                                    disabled
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"

                                />
                            )}
                        </div>
                        <div className="flex-grow">
                            <label htmlFor="state"
                                              className="block text-sm font-medium text-gray-700"
                                              >State:</label>
                            {editMode ? (
                                <input
                                    id="state"
                                    type="text"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"

                                />
                            ) : (
                                <input
                                    id="state"
                                    type="text"
                                    value={state}
                                    disabled
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"

                                />
                            )}
                        </div>
                        <div className="flex-grow">
                            <label htmlFor="country"
                                              className="block text-sm font-medium text-gray-700"
                                              >Country:</label>
                            {editMode ? (
                                <input
                                    id="country"
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"

                                />
                            ) : (
                                <input
                                    id="country"
                                    type="text"
                                    value={country}
                                    disabled
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"

                                />
                            )}
                        </div>
                        <button 
                                      className="btn"
                                      onClick={editMode ? handleSaveProfile : handleEditProfile}>
                            {editMode ? 'Save Profile' : 'Edit Profile'}
                        </button>
                    </div>
                )}
                <h3>Actions</h3>
                <button className="btn" onClick={handleViewApplications}>View Applications</button>
                <button className="btn" onClick={handleAddJobOffer}>Add Job Offer</button>
                <button className="btn" onClick={handleChangePassword}>Change Password</button>
                <button className="btn" onClick={handleChangeEmail}>Change Email</button>
                <button className="btn" onClick={handleDeleteAccount}>Delete Account</button>
                <button className="btn" onClick={logout}>Logout</button>
            </div>
        </>
    );
};

export default EmployerProfile;
