import React, { useEffect, useState } from 'react';
import { apiCall } from './helper';
import './gamecard.css'
import './dashboard.css'

function Dashboard() {
    const [game, setGame] = useState('');
    const [error, setError] = useState('');
    const token = localStorage.getItem("token");

    // retrieve games
    const handleGame = async(e) => {
        //e.preventDefault();
        const data = await apiCall('GET', 'http://localhost:5005/admin/games', null, setError, "Retrieve game data failed");
        console.log("data success");
        console.log(data);
        // show data
        setGame(data);
    }

    // create a game
    let newGameData = {}
    const createGame = async(e) => {
        const res = await fetch('http://localhost:5005/admin/games', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : undefined,
            },
            body: JSON.stringify(newGameData)
        })
        if (!res.ok) {
            const error = await res.json();
            console.log(error)
            setError(error.error || "Create game failed");
            return;
        }
        const data = await res.json();
        console.log("creation success");
        console.log(data);
    }
    
    // make a card for each game
    const GameCard = ({game}) => {
        return (
          <div className="game-card">
            <h3>{game.name}</h3>
            <p>ID: {game.id}</p>
            <button>Edit</button>
            <button>Delete</button>
          </div>
        );
    };
    
    // show all the games
    const renderGameList = () => {
        if (!game.games || game.games.length === 0) {
            return <p>Currently no games</p>
        }
        return game.games.map((game) => (
            <GameCard key={game.id} game={game} />
        ));
    }
    
    useEffect(() => {
        handleGame();
    }, [])

    return (
        <div className='game-container'>
            {error && <p className="error-message">{error}</p>}
            <div className="game-list">
                {renderGameList()}
            </div>
            <button className="submit-game" type="submit" onClick={createGame}>Create a new game</button>
        </div>
    );
}

export default Dashboard;