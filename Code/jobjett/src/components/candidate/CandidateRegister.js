import React ,{ useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const CandidateRegister = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', firstName: '', lastName: '', dateOfBirth: '', phone: '', address: '', state: '', country: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:9000/Candidate/registerCandidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      console.log('Registration successful');

      // After successful registration, automatically log in
      const loginResponse = await fetch('http://localhost:9000/Candidate/loginCandidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
        credentials: 'include'
      });

      if (!loginResponse.ok) {
        throw new Error('Login failed');
      }

      console.log('Login successful');

      // Redirect to profile page after successful registration and login
      navigate('/candidate/profile');
    } catch (error) {
      console.error('Error registering candidate:', error);
    }
  };

  return (
    <div>
      <h2>Candidate Registration</h2>
      <form onSubmit={handleSubmit}>
        {/* Input fields for registration form */}
        <button type="submit">Register</button>
      </form>
      <p>Already Registered? <Link to="/candidate/login">Login here</Link></p>
    </div>
  );
};

export default CandidateRegister;
