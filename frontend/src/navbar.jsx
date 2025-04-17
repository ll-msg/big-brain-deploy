import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './main.css'

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
    <nav className="flex justify-between items-center bg-green-800 px-5 py-2">
      <div className="text-white text-2xl font-bold">BigBrain</div>
      <ul className="flex gap-5 list-none">
        {!isLoggedIn && (
          <>
            <li><Link to="/login" className="text-white no-underline hover:underline">Login</Link></li>
            <li><Link to="/register" className="text-white no-underline hover:underline">Register</Link></li>
          </>
        )}
        <li><Link to="/session/join" className="text-white no-underline hover:underline">Join Game</Link></li>
        {isLoggedIn && (
          <>
            <li><Link to="/dashboard" className="text-white no-underline hover:underline">Dashboard</Link></li>
            <li onClick={handleLogout} className="text-white cursor-pointer hover:underline">Logout</li>
          </>
        )}
      </ul>
    </nav>
  );
}
export default Navbar;
