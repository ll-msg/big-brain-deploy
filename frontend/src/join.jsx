import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from './helper';

function Join() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState('');
  const navigate = useNavigate();


  const joinGame = async(e) => {
    e.preventDefault();
    const body = {
      name: username
    };
    localStorage.setItem('player', username);
    const res = await apiCall('POST', `http://localhost:5005/play/join/${sessionId}`, body, setError, "Failed to join the game");
    localStorage.setItem('playerId', res.playerId);
    navigate(`/session/play/${sessionId}`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white px-4">
      <div className="bg-neutral-800 p-8 rounded-xl shadow-md w-full max-w-sm space-y-6">
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <h2 className="text-2xl font-bold text-center">Join Game</h2>
        
        <form onSubmit={joinGame} className="space-y-4">
          <input type="text" value={username} placeholder='Enter your name' onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 rounded border border-gray-300 text-white" required/>
          <input type="text" value={sessionId} placeholder='Enter your session id' onChange={(e) => setSessionId(e.target.value)} className="w-full px-4 py-2 rounded border border-gray-300 text-white" required/>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition">Join</button>
        </form>
      </div>
    </div>
  )
}

export default Join;