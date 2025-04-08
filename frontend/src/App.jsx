import { useNavigate, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login from './login';
import Register from './register'
import Navbar from './navbar';
import Dashboard from './dashboard';
import Questions from './questions';

function App() {
  const [count, setCount] = useState(0);
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/game/:gameId' element={<Questions />} />
      </Routes>
    </>
  )
}

export default App
