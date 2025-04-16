import { useNavigate, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login from './login';
import Register from './register'
import Navbar from './navbar';
import Dashboard from './dashboard';
import Questions from './questions';
import QuestionEdit from './questionEdit';
import Session from './session';
import Join from './join';
import Play from './play';
import Result from './sessionResult';

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
        <Route path='/session/:sessionId' element={<Session />} />
        <Route path='/session/:sessionId/result' element={<Result />} />
        <Route path='/session/join' element={<Join />} />
        <Route path='/session/play/:sessionId' element={<Play />} />
      </Routes>
    </>
  )
}

export default App
