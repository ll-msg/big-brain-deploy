import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userIcon from './assets/user.png'
import emailIcon from './assets/email.png'
import passwordIcon from './assets/password.png'


function Register() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
      
  // register action
  const handleRegister = async(e) => {
    e.preventDefault();
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
      return;
    }
    const data = await res.json();
    // save token - need to change
    localStorage.setItem("token", data);
    console.log("Successfully register");
    // navigate to login page after registration
    navigate('/login');
  }

  return (
    <div className="flex flex-col w-[530px] bg-black mt-[100px] mb-[100px] mx-auto pb-[30px]">
      <div className="flex flex-col items-center gap-[9px] w-full mt-[30px]">
        <div className="text-white text-[40px] font-bold">Sign up</div>
      </div>
      <form className="flex flex-col mt-[55px] gap-[25px]" onSubmit={handleRegister}>
        {error && <p className="text-red-600 text-center">{error}</p>}
    
        <div className="flex items-center mx-auto w-[380px] h-[50px] bg-[#e4e3e3] rounded-[6px]">
          <img src={userIcon} alt="username" className="w-[20px] h-[20px] ml-[10px]" />
          <input
            name='name'
            type="text"
            placeholder="UserName"
            className="h-[50px] w-[400px] border-none outline-none bg-transparent text-[15px] font-[Courier_New] pl-[30px] opacity-50"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
    
        <div className="flex items-center mx-auto w-[380px] h-[50px] bg-[#e4e3e3] rounded-[6px]">
          <img src={emailIcon} alt="email" className="w-[20px] h-[20px] ml-[10px]" />
          <input
            name='email'
            type="email"
            placeholder="Email"
            className="h-[50px] w-[400px] border-none outline-none bg-transparent text-[15px] font-[Courier_New] pl-[30px] opacity-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
    
        <div className="flex items-center mx-auto w-[380px] h-[50px] bg-[#e4e3e3] rounded-[6px]">
          <img src={passwordIcon} alt="password" className="w-[20px] h-[20px] ml-[10px]" />
          <input
            name='password'
            type="password"
            placeholder="Password"
            className="h-[50px] w-[400px] border-none outline-none bg-transparent text-[15px] font-[Courier_New] pl-[30px] opacity-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
    
        <div className="flex items-center mx-auto w-[380px] h-[50px] bg-[#e4e3e3] rounded-[6px]">
          <img src={passwordIcon} alt="confirm-password" className="w-[20px] h-[20px] ml-[10px]" />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className="h-[50px] w-[400px] border-none outline-none bg-transparent text-[15px] font-[Courier_New] pl-[30px] opacity-50"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
    
        <div className="ml-[65px] text-white">
              Already had an account? <a href="/login" className="text-blue-600 underline">Login here</a>
        </div>
    
        <div className="flex gap-[30px] mx-auto mt-[60px]">
          <button
            className="w-[170px] h-[50px] text-black bg-white rounded-[40px] font-bold text-[17px] font-[Trebuchet_MS] cursor-pointer"
            type="submit"
          >
                Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
