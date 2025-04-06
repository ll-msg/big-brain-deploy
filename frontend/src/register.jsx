import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userIcon from './assets/user.png'
import emailIcon from './assets/email.png'
import passwordIcon from './assets/password.png'

import './auth.css';

function Register() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
      
    // register action
    const handleRegister = async(e) => {
        // confirm password
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const res = await fetch('http://localhost:5005/admin/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                username
            })
        });
        if (!res.ok) {
            console.log(res)
            const error = await res.json();
            setError(error.error || 'Registration failed');
        }
        const data = await res.json();
        // save token - need to change
        localStorage.setItem("token", data);
        console.log("Successfully register");
        // navigate to login page after registration
        navigate('/login');
    }

    return (
        <div className = 'container'>
            <div className="header">
                <div className='text'> Sign up </div>
            </div>
            <form className="inputs" onSubmit={handleRegister}>
                {error && <p className="error-message">{error}</p>}
                <div className='input'>
                    <img src={userIcon} alt="Name" />
                    <input type="text" placeholder='UserName' value={username} onChange={(e) => setUsername(e.target.value)} required/>
                </div>

                <div className='input'>
                    <img src={emailIcon} alt="email" />
                    <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>

                <div className='input'>
                    <img src={passwordIcon} alt="password" />
                    <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>

                <div className='input'>
                    <img src={passwordIcon} alt="password" />
                    <input type="password" placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                </div>

                <div className='auth-link'>
                    Already had an account? <a href="/login">Login here</a>
                </div>

                <div className="submit-container">
                    <button className="submit" type="submit">Sign Up</button>
                </div>
            </form>
        </div>
    )
}

export default Register;