import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../NavBar/EmployerNavbar.jsx";
import defaultlogo from "../../../assets/default-logo.png";

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
    const [logo, setLogo] = useState("");
    const [logoPath, setLogoPath] = useState("");

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
            setLogoPath(employerInfo.logo);
            
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
                setLogoPath(data.logo);
            } else {
                const errorData = await response.json();
                console.error(errorData);
                alert(`${errorData.error}`);            }
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
                const errorData = await response.json();
                console.error(errorData);
                alert(`${errorData.error}`);            }
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Invalid email format');
            return;
        }
        
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            alert('Invalid phone number format');
            return;
        }

        if (!companyName.trim()) {
            alert('Company name is required');
            return;
        }
    
        if (!industry.trim()) {
            alert('Industry is required');
            return;
        }
    
        if (!address.trim()) {
            alert('Address is required');
            return;
        }
    
        if (!state.trim()) {
            alert('State is required');
            return;
        }
    
        if (!country.trim()) {
            alert('Country is required');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('companyName', companyName);
            formData.append('email', email);
            formData.append('industry', industry);
            formData.append('phone', phone);
            formData.append('address', address);
            formData.append('state', state);
            formData.append('country', country);
            
            if (logo) {
                formData.append('logo', logo);
            }
            console.log(logo.name);
            const response = await fetch(
                'http://localhost:9000/Employer/updateProfile',
                {
                    method: 'PUT',
                    credentials: 'include',
                    body: formData
                }
            );
            if (response.ok) {
                console.log('Profile updated successfully');
                setEditMode(false);
                fetchEmployerInfo();
            } else {
                const errorData = await response.json();
                console.error(errorData);
                alert(`${errorData.error}`);            }
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
                    <form encType="multipart/form-data">
                        <div className="flex-grow relative">
                            {editMode ? (
                                <input
                                    id="logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setLogo(e.target.files[0])}
                                    className="hidden"
                                />
                            ) : null}
                            <img
                                src={logoPath || defaultlogo}
                                alt="Company Logo"
                                className="w-20 h-20 rounded-full mx-auto"
                            />
                            {editMode ? (
                                <label htmlFor="logo" className="text-black rounded-full p-1 cursor-pointer border border-black mt-2 mx-auto text-center">
                                    Change Company Logo
                                </label>
                            ) : null}
                        </div>
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
                                disabled
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
                            type="button"
                            className="btn"
                            onClick={editMode ? handleSaveProfile : handleEditProfile}>
                            {editMode ? 'Save Profile' : 'Edit Profile'}
                        </button>
                    </form>
                )}
                <h3>Actions</h3>
                <button className="btn" onClick={handleViewApplications}>View Applications</button>
                <button className="btn" onClick={handleAddJobOffer}>Add Job Offer</button>
                <button className="btn" onClick={handleChangePassword}   style={{ width: 'auto' }}>Change Password</button>
                <button className="btn" onClick={handleChangeEmail}>Change Email</button>
                <button className="btn" onClick={handleDeleteAccount}>Delete Account</button>
                <button className="btn" onClick={logout}>Logout</button>
            </div>
        </>
    );
};

export default EmployerProfile;
