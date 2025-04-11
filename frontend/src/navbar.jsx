import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import './navbar.css'

function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLogin = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        }
        checkLogin();
        window.addEventListener('loggedIn', checkLogin);
        return () => window.removeEventListener('loggedIn', checkLogin);
    }, []);

    const handleLogout = async() => {
        // clear token - need to change
        const token = localStorage.getItem('token');

        const res = await fetch('http://localhost:5005/admin/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            throw new Error('Logout failed');
        }
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    }

    return (
        <nav className="navbar">
        <div className="nav-logo">BigBrain</div>
        <ul className="nav-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            {!isLoggedIn && (
                <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                </>
            )}
            <li><Link to="/session/join">Join Game</Link></li>
            {isLoggedIn && (
                <li className="logout-link" onClick={handleLogout}>Logout</li>
            )}
            
        </ul>
        </nav>
    );
}
export default Navbar;