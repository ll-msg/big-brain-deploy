import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCall } from './helper';

function Join() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [playerId, setPlayerId] = useState('');
    const navigate = useNavigate();


    const joinGame = async(e) => {
        e.preventDefault();
        const body = {
            name: username
        };
        localStorage.setItem('player', username);
        const res = await apiCall('POST', `http://localhost:5005/play/join/${sessionId}`, body, setError, "Failed to join the game");
        setPlayerId(res.playerId);
        localStorage.setItem('playerId', res.playerId);
        navigate(`/session/play/${sessionId}`);
    }

    return (
        <div className="join-container">
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={joinGame} className="join-form">
                <input type="text" value={username} placeholder='Enter your name' onChange={(e) => setUsername(e.target.value)} />
                <input type="text" value={sessionId} placeholder='Enter your session id' onChange={(e) => setSessionId(e.target.value)} />
                <button type="submit">Join</button>
            </form>
        </div>
    )
}

export default Join;