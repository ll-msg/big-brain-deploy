import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailIcon from './assets/email.png'
import passwordIcon from './assets/password.png'

import './auth.css';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    // login action
    const handleLogin = async(e) => {
        console.log(email);
        e.preventDefault();
        const res = await fetch('http://localhost:5005/admin/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        if (!res.ok) {
            const error = await res.json();
            console.log(error)
            setError(error.error || "Login Failed");
        }
        const data = await res.json();
        console.log(res)
        // save token - need to change
        localStorage.setItem("token", data.token);
        console.log("Successfully login");
        // navigate to home page after registration
        navigate('/dashboard');
    }

    return (
        <div className = 'container'>
            <div className="header">
                <div className='text'> Login </div>
            </div>
            <form className="inputs" onSubmit={handleLogin}>
                {error && <p className="error-message">{error}</p>}
                <div className='input'>
                    <img src={emailIcon} alt="email" />
                    <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>

                <div className='input'>
                    <img src={passwordIcon} alt="password" />
                    <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>

                <div className='auth-link'>
                    Haven't got an account? <a href="/register">Register here</a>
                </div>
                <div className="submit-container">
                    <button className='submit' type="submit"> Login </button>
                </div>
            </form>
        </div>
    )
}

export default Login;
