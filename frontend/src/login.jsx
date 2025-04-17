import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailIcon from './assets/email.png'
import passwordIcon from './assets/password.png'


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
      return;
    }
    const data = await res.json();
    console.log(res)
    // save token - need to change
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", email);
    // set logged in status for navbar change
    window.dispatchEvent(new Event('loggedIn'));
    console.log("Successfully login");
    // navigate to home page after registration
    navigate('/dashboard');
  }

  return (
    <div className="flex flex-col w-[530px] bg-[#166229] mt-[200px] mx-auto pb-[30px]">
      <div className="flex flex-col items-center gap-[9px] w-full mt-[30px]">
        <div className="text-[#030303] text-[40px] font-bold">Login</div>
      </div>
      <form className="flex flex-col mt-[55px] gap-[25px]" onSubmit={handleLogin}>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <div className="flex items-center mx-auto w-[380px] h-[50px] bg-[#e4e3e3] rounded-[6px]">
          <img src={emailIcon} alt="email" className="w-[20px] h-[20px] ml-[10px]" />
          <input
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
            type="password"
            placeholder="Password"
            className="h-[50px] w-[400px] border-none outline-none bg-transparent text-[15px] font-[Courier_New] pl-[30px] opacity-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="ml-[65px]">
              Have not got an account yet? <a href="/register" className="text-blue-600 underline">Register here</a>
        </div>
        <div className="flex gap-[30px] mx-auto mt-[60px]">
          <button
            className="w-[170px] h-[50px] text-[aliceblue] bg-[#166229] rounded-[40px] font-bold text-[17px] font-[Trebuchet_MS] cursor-pointer"
            type="submit"
          >
                Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;

