import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiCall } from './helper';

// the url should look like: http://localhost:port/join?sessionId=***
// get session id passed by the admin
const useQuery = () => new URLSearchParams(useLocation().search);

function Join() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState('');
  const navigate = useNavigate();
  const query = useQuery();


  const joinGame = async(e) => {
    e.preventDefault();
    if (!username || !sessionId) {
      setError("Please enter your name and session ID");
      return;
    }
    
    const body = {
      name: username
    };
    sessionStorage.setItem('player', username);
    const res = await apiCall('POST', `http://localhost:5005/play/join/${sessionId}`, body, setError, "Failed to join the game");
    sessionStorage.setItem('playerId', res.playerId);
    navigate(`/session/play/${sessionId}`);
  }

  useEffect(() => {
    const fromUrl = query.get('sessionId');
    if (fromUrl) {
      setSessionId(fromUrl);
    }
  }, []);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white px-4">
      <div className="bg-neutral-800 p-8 rounded-xl shadow-md w-full max-w-sm space-y-6">
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <h2 className="text-2xl font-bold text-center">Join Game</h2>
        
        <form onSubmit={joinGame} className="space-y-4">
          <input type="text" value={username} placeholder='Enter your name' onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 rounded border border-gray-300 text-white" required/>
          <input type="text" value={sessionId} placeholder='Enter your session id' onChange={(e) => setSessionId(e.target.value)} className="w-full px-4 py-2 rounded border border-gray-300 text-white" required/>
          <button name='join-game' type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition">Join</button>
        </form>
      </div>
    </div>
  )
}

export default Join;