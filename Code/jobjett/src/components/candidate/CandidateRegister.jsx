import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from "../../assets/output-onlinetools.png";
import "./CandidateRegister.css";
import Navbar from "../NavBar/Navbar.jsx";

const countryOptions = [
  { value: "Afghanistan", label: "Afghanistan" },
  { value: "Åland Islands", label: "Åland Islands" },
  { value: "Albania", label: "Albania" },
  { value: "Algeria", label: "Algeria" },
  { value: "American Samoa", label: "American Samoa" },
  { value: "Andorra", label: "Andorra" },
  { value: "Angola", label: "Angola" },
  { value: "Anguilla", label: "Anguilla" },
  { value: "Antarctica", label: "Antarctica" },
  { value: "Antigua and Barbuda", label: "Antigua and Barbuda" },
  { value: "Argentina", label: "Argentina" },
  { value: "Armenia", label: "Armenia" },
  { value: "Aruba", label: "Aruba" },
  { value: "Australia", label: "Australia" },
  { value: "Austria", label: "Austria" },
  { value: "Azerbaijan", label: "Azerbaijan" },
  { value: "Bahamas", label: "Bahamas" },
  { value: "Bahrain", label: "Bahrain" },
  { value: "Bangladesh", label: "Bangladesh" },
  { value: "Barbados", label: "Barbados" },
  { value: "Belarus", label: "Belarus" },
  { value: "Belgium", label: "Belgium" },
  { value: "Belize", label: "Belize" },
  { value: "Benin", label: "Benin" },
  { value: "Bermuda", label: "Bermuda" },
  { value: "Bhutan", label: "Bhutan" },
  { value: "Bolivia", label: "Bolivia" },
  { value: "Bosnia and Herzegovina", label: "Bosnia and Herzegovina" },
  { value: "Botswana", label: "Botswana" },
  { value: "Bouvet Island", label: "Bouvet Island" },
  { value: "Brazil", label: "Brazil" },
  {
    value: "British Indian Ocean Territory",
    label: "British Indian Ocean Territory",
  },
  { value: "Brunei Darussalam", label: "Brunei Darussalam" },
  { value: "Bulgaria", label: "Bulgaria" },
  { value: "Burkina Faso", label: "Burkina Faso" },
  { value: "Burundi", label: "Burundi" },
  { value: "Cambodia", label: "Cambodia" },
  { value: "Cameroon", label: "Cameroon" },
  { value: "Canada", label: "Canada" },
  { value: "Cape Verde", label: "Cape Verde" },
  { value: "Cayman Islands", label: "Cayman Islands" },
  { value: "Central African Republic", label: "Central African Republic" },
  { value: "Chad", label: "Chad" },
  { value: "Chile", label: "Chile" },
  { value: "China", label: "China" },
  { value: "Christmas Island", label: "Christmas Island" },
  { value: "Cocos (Keeling) Islands", label: "Cocos (Keeling) Islands" },
  { value: "Colombia", label: "Colombia" },
  { value: "Comoros", label: "Comoros" },
  { value: "Congo", label: "Congo" },
  {
    value: "Congo, The Democratic Republic of The",
    label: "Congo, The Democratic Republic of The",
  },
  { value: "Cook Islands", label: "Cook Islands" },
  { value: "Costa Rica", label: "Costa Rica" },
  { value: "Cote D'ivoire", label: "Cote D'ivoire" },
  { value: "Croatia", label: "Croatia" },
  { value: "Cuba", label: "Cuba" },
  { value: "Curaçao", label: "Curaçao" },
  { value: "Cyprus", label: "Cyprus" },
  { value: "Czech Republic", label: "Czech Republic" },
  { value: "Denmark", label: "Denmark" },
  { value: "Djibouti", label: "Djibouti" },
  { value: "Dominica", label: "Dominica" },
  { value: "Dominican Republic", label: "Dominican Republic" },
  { value: "Ecuador", label: "Ecuador" },
  { value: "Egypt", label: "Egypt" },
  { value: "El Salvador", label: "El Salvador" },
  { value: "Equatorial Guinea", label: "Equatorial Guinea" },
  { value: "Eritrea", label: "Eritrea" },
  { value: "Estonia", label: "Estonia" },
  { value: "Ethiopia", label: "Ethiopia" },
  {
    value: "Falkland Islands (Malvinas)",
    label: "Falkland Islands (Malvinas)",
  },
  { value: "Faroe Islands", label: "Faroe Islands" },
  { value: "Fiji", label: "Fiji" },
  { value: "Finland", label: "Finland" },
  { value: "France", label: "France" },
  { value: "French Guiana", label: "French Guiana" },
  { value: "French Polynesia", label: "French Polynesia" },
  {
    value: "French Southern Territories",
    label: "French Southern Territories",
  },
  { value: "Gabon", label: "Gabon" },
  { value: "Gambia", label: "Gambia" },
  { value: "Georgia", label: "Georgia" },
  { value: "Germany", label: "Germany" },
  { value: "Ghana", label: "Ghana" },
  { value: "Gibraltar", label: "Gibraltar" },
  { value: "Greece", label: "Greece" },
  { value: "Greenland", label: "Greenland" },
  { value: "Grenada", label: "Grenada" },
  { value: "Guadeloupe", label: "Guadeloupe" },
  { value: "Guam", label: "Guam" },
  { value: "Guatemala", label: "Guatemala" },
  { value: "Guernsey", label: "Guernsey" },
  { value: "Guinea", label: "Guinea" },
  { value: "Guinea-bissau", label: "Guinea-bissau" },
  { value: "Guyana", label: "Guyana" },
  { value: "Haiti", label: "Haiti" },
  {
    value: "Heard Island and Mcdonald Islands",
    label: "Heard Island and Mcdonald Islands",
  },
  {
    value: "Holy See (Vatican City State)",
    label: "Holy See (Vatican City State)",
  },
  { value: "Honduras", label: "Honduras" },
  { value: "Hong Kong", label: "Hong Kong" },
  { value: "Hungary", label: "Hungary" },
  { value: "Iceland", label: "Iceland" },
  { value: "India", label: "India" },
  { value: "Indonesia", label: "Indonesia" },
  { value: "Iran, Islamic Republic of", label: "Iran, Islamic Republic of" },
  { value: "Iraq", label: "Iraq" },
  { value: "Ireland", label: "Ireland" },
  { value: "Isle of Man", label: "Isle of Man" },
  { value: "Israel", label: "Israel" },
  { value: "Italy", label: "Italy" },
  { value: "Jamaica", label: "Jamaica" },
  { value: "Japan", label: "Japan" },
  { value: "Jersey", label: "Jersey" },
  { value: "Jordan", label: "Jordan" },
  { value: "Kazakhstan", label: "Kazakhstan" },
  { value: "Kenya", label: "Kenya" },
  { value: "Kiribati", label: "Kiribati" },
  {
    value: "Korea, Democratic People's Republic of",
    label: "Korea, Democratic People's Republic of",
  },
  { value: "Korea, Republic of", label: "Korea, Republic of" },
  { value: "Kuwait", label: "Kuwait" },
  { value: "Kyrgyzstan", label: "Kyrgyzstan" },
  {
    value: "Lao People's Democratic Republic",
    label: "Lao People's Democratic Republic",
  },
  { value: "Latvia", label: "Latvia" },
  { value: "Lebanon", label: "Lebanon" },
  { value: "Lesotho", label: "Lesotho" },
  { value: "Liberia", label: "Liberia" },
  { value: "Libyan Arab Jamahiriya", label: "Libyan Arab Jamahiriya" },
  { value: "Liechtenstein", label: "Liechtenstein" },
  { value: "Lithuania", label: "Lithuania" },
  { value: "Luxembourg", label: "Luxembourg" },
  { value: "Macao", label: "Macao" },
  {
    value: "Macedonia, The Former Yugoslav Republic of",
    label: "Macedonia, The Former Yugoslav Republic of",
  },
  { value: "Madagascar", label: "Madagascar" },
  { value: "Malawi", label: "Malawi" },
  { value: "Malaysia", label: "Malaysia" },
  { value: "Maldives", label: "Maldives" },
  { value: "Mali", label: "Mali" },
  { value: "Malta", label: "Malta" },
  { value: "Marshall Islands", label: "Marshall Islands" },
  { value: "Martinique", label: "Martinique" },
  { value: "Mauritania", label: "Mauritania" },
  { value: "Mauritius", label: "Mauritius" },
  { value: "Mayotte", label: "Mayotte" },
  { value: "Mexico", label: "Mexico" },
  {
    value: "Micronesia, Federated States of",
    label: "Micronesia, Federated States of",
  },
  { value: "Moldova, Republic of", label: "Moldova, Republic of" },
  { value: "Monaco", label: "Monaco" },
  { value: "Mongolia", label: "Mongolia" },
  { value: "Montenegro", label: "Montenegro" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Morocco", label: "Morocco" },
  { value: "Mozambique", label: "Mozambique" },
  { value: "Myanmar", label: "Myanmar" },
  { value: "Namibia", label: "Namibia" },
  { value: "Nauru", label: "Nauru" },
  { value: "Nepal", label: "Nepal" },
  { value: "Netherlands", label: "Netherlands" },
  { value: "New Caledonia", label: "New Caledonia" },
  { value: "New Zealand", label: "New Zealand" },
  { value: "Nicaragua", label: "Nicaragua" },
  { value: "Niger", label: "Niger" },
  { value: "Nigeria", label: "Nigeria" },
  { value: "Niue", label: "Niue" },
  { value: "Norfolk Island", label: "Norfolk Island" },
  { value: "Northern Mariana Islands", label: "Northern Mariana Islands" },
  { value: "Norway", label: "Norway" },
  { value: "Oman", label: "Oman" },
  { value: "Pakistan", label: "Pakistan" },
  { value: "Palau", label: "Palau" },
  {
    value: "Palestinian Territory, Occupied",
    label: "Palestinian Territory, Occupied",
  },
  { value: "Panama", label: "Panama" },
  { value: "Papua New Guinea", label: "Papua New Guinea" },
  { value: "Paraguay", label: "Paraguay" },
  { value: "Peru", label: "Peru" },
  { value: "Philippines", label: "Philippines" },
  { value: "Pitcairn", label: "Pitcairn" },
  { value: "Poland", label: "Poland" },
  { value: "Portugal", label: "Portugal" },
  { value: "Puerto Rico", label: "Puerto Rico" },
  { value: "Qatar", label: "Qatar" },
  { value: "Reunion", label: "Reunion" },
  { value: "Romania", label: "Romania" },
  { value: "Russia", label: "Russia" },
  { value: "Rwanda", label: "Rwanda" },
  { value: "Saint Helena", label: "Saint Helena" },
  { value: "Saint Kitts and Nevis", label: "Saint Kitts and Nevis" },
  { value: "Saint Lucia", label: "Saint Lucia" },
  { value: "Saint Pierre and Miquelon", label: "Saint Pierre and Miquelon" },
  {
    value: "Saint Vincent and The Grenadines",
    label: "Saint Vincent and The Grenadines",
  },
  { value: "Samoa", label: "Samoa" },
  { value: "San Marino", label: "San Marino" },
  { value: "Sao Tome and Principe", label: "Sao Tome and Principe" },
  { value: "Saudi Arabia", label: "Saudi Arabia" },
  { value: "Senegal", label: "Senegal" },
  { value: "Serbia", label: "Serbia" },
  { value: "Seychelles", label: "Seychelles" },
  { value: "Sierra Leone", label: "Sierra Leone" },
  { value: "Singapore", label: "Singapore" },
  { value: "Slovakia", label: "Slovakia" },
  { value: "Slovenia", label: "Slovenia" },
  { value: "Solomon Islands", label: "Solomon Islands" },
  { value: "Somalia", label: "Somalia" },
  { value: "South Africa", label: "South Africa" },
  {
    value: "South Georgia and The South Sandwich Islands",
    label: "South Georgia and The South Sandwich Islands",
  },
  { value: "Spain", label: "Spain" },
  { value: "Sri Lanka", label: "Sri Lanka" },
  { value: "Sudan", label: "Sudan" },
  { value: "Suriname", label: "Suriname" },
  { value: "Svalbard and Jan Mayen", label: "Svalbard and Jan Mayen" },
  { value: "Eswatini", label: "Eswatini" },
  { value: "Sweden", label: "Sweden" },
  { value: "Switzerland", label: "Switzerland" },
  { value: "Syrian Arab Republic", label: "Syrian Arab Republic" },
  { value: "Taiwan (ROC)", label: "Taiwan (ROC)" },
  { value: "Tajikistan", label: "Tajikistan" },
  {
    value: "Tanzania, United Republic of",
    label: "Tanzania, United Republic of",
  },
  { value: "Thailand", label: "Thailand" },
  { value: "Timor-leste", label: "Timor-leste" },
  { value: "Togo", label: "Togo" },
  { value: "Tokelau", label: "Tokelau" },
  { value: "Tonga", label: "Tonga" },
  { value: "Trinidad and Tobago", label: "Trinidad and Tobago" },
  { value: "Tunisia", label: "Tunisia" },
  { value: "Turkey", label: "Turkey" },
  { value: "Turkmenistan", label: "Turkmenistan" },
  { value: "Turks and Caicos Islands", label: "Turks and Caicos Islands" },
  { value: "Tuvalu", label: "Tuvalu" },
  { value: "Uganda", label: "Uganda" },
  { value: "Ukraine", label: "Ukraine" },
  { value: "United Arab Emirates", label: "United Arab Emirates" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "United States", label: "United States" },
  {
    value: "United States Minor Outlying Islands",
    label: "United States Minor Outlying Islands",
  },
  { value: "Uruguay", label: "Uruguay" },
  { value: "Uzbekistan", label: "Uzbekistan" },
  { value: "Vanuatu", label: "Vanuatu" },
  { value: "Venezuela", label: "Venezuela" },
  { value: "Vietnam", label: "Vietnam" },
  { value: "Virgin Islands, British", label: "Virgin Islands, British" },
  { value: "Virgin Islands, U.S.", label: "Virgin Islands, U.S." },
  { value: "Wallis and Futuna", label: "Wallis and Futuna" },
  { value: "Western Sahara", label: "Western Sahara" },
  { value: "Yemen", label: "Yemen" },
  { value: "Zambia", label: "Zambia" },
  { value: "Zimbabwe", label: "Zimbabwe" },
];


const CandidateRegister = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState(1);
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const checkLoggedIn = async () => {
        try {
            const response = await fetch('http://localhost:9000/Candidate/loginCandidate/checkCandidateAuth', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.loggedIn) {
                    navigate("/candidate/profile");
                    window.location.reload();
                }
            } else {
                console.error('Failed to check if candidate is logged in');
            }
        } catch (error) {
            console.error('Error checking if candidate is logged in:', error);
        }
    };

    useEffect(() => {
        checkLoggedIn();
    }, []);

    const registerCandidate = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const password = formData.get('password');
        if (password !== formData.get('passwordConfirmation')) {
            console.error('Password and confirmation do not match');
            return;
        }
        const day = parseInt(formData.get('day'), 10) + 1;
        const month = parseInt(formData.get('month'), 10) - 1;
        const year = parseInt(formData.get('year'), 10);
        const dateOfBirth = new Date(year, month, day);
        try {
            const response = await fetch('http://localhost:9000/Candidate/registerCandidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: formData.get('email'),
                    password: formData.get('password'),
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    dateOfBirth: dateOfBirth,
                    phone: formData.get('phone'),
                    address: formData.get('address'),
                    state: formData.get('state'),
                    country: formData.get('country')
                })
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            console.log('Registration successful');
            const loginResponse = await fetch('http://localhost:9000/Candidate/loginCandidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: formData.get('email'),
                    password: formData.get('password')
                })
            });

            if (!loginResponse.ok) {
                throw new Error('Login failed');
            }

            console.log('Login successful');
            navigate("/candidate/profile");
        } catch (error) {
            console.error('Error registering candidate:', error);
        }
    };
    const nextButtonFunction = () => {
        setActive((prevActive) => Math.min(prevActive + 1, 3));
      };
    
      const prevButtonFunction = () => {
        setActive((prevActive) => Math.max(prevActive - 1, 1));
      };

    return (
      <>
      <Navbar></Navbar>
        <div
        id="page"
        className="site flex flex-row min-h-screen justify-center items-center"
      >
        <div className="container flex flex-row min-h-screen justify-center items-center ">
          <div className="form-box ">
            <div className="progress">
              <div className="logo">
                <Link to="">
                  <img src={logo} alt="Logo"></img>
                </Link>
              </div>
              <ul className="progress-steps">
                <li className={`step ${active === 1 ? "active" : ""}`}>
                  <span>1</span>
                  <p>
                    Personal<br></br>
                  </p>
                </li>
                <li className={`step ${active === 2 ? "active" : ""}`}>
                  <span>2</span>
                  <p>
                    Contact<br></br>
                  </p>
                </li>
                <li className={`step ${active === 3 ? "active" : ""}`}>
                  <span>3</span>
                  <p>
                    Security<br></br>
                  </p>
                </li>
              </ul>
            </div>
            <form onSubmit={registerCandidate} id="candidateRegistrationForm">
              <div
                className={`form-one form-step ${active === 1 ? "active" : ""}`}
              >
                <div className="bg-svg"></div>
                <h2>Personal Information</h2>
                <p>Enter your information correctly</p>
                <div>
                  <label>First Name</label>
                  <input type="text" id="firstName" name="firstName" required></input>
                </div>
                <div>
                  <label>Last Name</label>
                  <input type="text" id="lastName" name="lastName" required></input>
                </div>
                <div className="birth">
                  <label>Date of birth</label>
                  <div className="grouping">
                    <input
                      type="number"
                      pattern="[0-9]"
                      name="day"
                      min="1"
                      max="31"
                      maxLength="2"
                      placeholder="DD"
                      required
                    ></input>
                    <input
                      type="number"
                      pattern="[0-9]"
                      name="month"
                      min="1"
                      max="12"
                      maxLength="2"
                      placeholder="MM"
                      required
                    ></input>
                    <input
                      type="number"
                      pattern="[0-9]"
                      name="year"
                      min="1900"
                      max="2050"
                      maxLength="4"
                      placeholder="YYYY"
                      required
                    ></input>
                  </div>
                </div>
              </div>
              <div
                className={`form-two form-step ${active === 2 ? "active" : ""}`}
              >
                <div className="bg-svg"></div>
                <h2>Contact Information</h2>
                <div>
                  <label>Phone</label>
                  <input type="text" id="phone" name="phone" required></input>
                </div>
                <div>
                  <label>Country</label>
                  <select name="country" id="country" required>
                    <option value="">Please select</option>
                    {countryOptions.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    placeholder="State/Province"
                    required
                  ></input>
                </div>
                <div>
                  <label>Address</label>
                  <input type="text" placeholder="Street Address" id="address" name="address"></input>
                </div>
              </div>
              <div
                className={`form-three form-step ${active === 3 ? "active" : ""}`}
              >
                <div className="bg-svg"></div>
                <h2>Security</h2>
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Your email address"
                    id="email" name="email"
                    required
                  ></input>
                </div>
                <div>
                  <label>Password</label>
                  <input type="password" placeholder="Password" id="password" name="password" required></input>
                </div>
                <div>
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    name="passwordConfirmation"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                  ></input>
                </div>
              </div>
              <div className="btn-group flex justify-between">
                <button
                  type="button"
                  className="btn-prev"
                  disabled={active === 1}
                  onClick={prevButtonFunction}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn-next"
                  onClick={nextButtonFunction}
                  disabled={active == 3}
                >
                  Next
                </button>
                <button type="submit" className="btn-submit">
                  Submit
                </button>
                <br></br><p>Already Registered? <Link to="/candidate/login">Login here</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
      </>
    );
};

export default CandidateRegister;