import { useNavigate, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login from './login';
import Register from './register'
import Navbar from './navbar';
import Dashboard from './dashboard';
import Questions from './questions';
import QuestionEdit from './questionEdit';

function App() {
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/game/:gameId' element={<Questions />} />
        <Route path='/game/:gameId/question/:questionId' element={<QuestionEdit />} />
      </Routes>
    </>
  )
}

export default App
