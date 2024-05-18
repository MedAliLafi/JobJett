import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from "../../NavBar/Navbar.jsx";
import logo from "../../../assets/output-onlinetools.png";
import "./EmployerLogin.css"

const EmployerLogin = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const checkLoggedIn = async () => {
        try {
            const response = await fetch('http://localhost:9000/Employer/loginEmployer/checkEmployerAuth', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.loggedIn) {
                    setIsLoggedIn(true);
                    navigate("/employer");
                }
            }
        } catch (error) {
            console.error('Error checking if employer is logged in:', error);
        }
    };

    useEffect(() => {
        checkLoggedIn();
    }, []);

    const handleForgotPasswordClick = () => {
      navigate('/employer/forgotpassword');
    };

    const loginEmployer = async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const email = formData.get('email');
      const password = formData.get('password');
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      try {
          if (!email || !password) {
              alert('Please fill in both email and password fields.');
              return;
          }
          if (!emailRegex.test(email)) {
              alert('Please enter a valid email address.');
              return;
          }
          const response = await fetch('http://localhost:9000/Employer/loginEmployer', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  email: email,
                  password: password,
                  rememberMe: rememberMe
              }),
              credentials: 'include'
          });
  
          if (response.ok) {
              setIsLoggedIn(true);
              navigate("/employer");
              window.location.reload();
          } else {
            const errorData = await response.json();
            alert(`${errorData.error}`);
            throw new Error(errorData.error);
          }
      } catch (error) {
          console.error('Error logging in employer:', error);
      }
  };
  
    return (
        <>
            <Navbar></Navbar>
            <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 min-h-screen">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <Link
              to="/"
              className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
            >
              <img className="mx-auto w-[160px]" src={logo} alt="logo" />{" "}
            </Link>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Employer login
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={loginEmployer}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500">
                      Remember me
                    </label>
                  </div>
                </div>
                <a
                  className="text-sm font-medium text-primary-600 hover:underline hover:text-blueColor"
                  onClick={handleForgotPasswordClick}
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blueColor hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-500">
                Don’t have an account yet?{" "}
                <Link
                  to="/employer/register"
                  className="font-medium text-primary-600 hover:underline hover:text-blueColor"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
        </>
    );
};

export default EmployerLogin;
