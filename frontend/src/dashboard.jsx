import React, { useEffect, useState } from 'react';
import { apiCall, fileToDataUrl } from './helper';
import defaultImage from './assets/default-image.jpg';
import CreateGameModal from './modal';
import './gamecard.css'
import './dashboard.css'

function Dashboard() {
    const [game, setGame] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
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
    const createGame = async(newGame) => {
        // get all games
        const email = localStorage.getItem("email");
        const originalGames = await apiCall('GET', 'http://localhost:5005/admin/games', null, setError, "Retrieve game data failed");
        // copy old games and add the new game
        const newGames = [...originalGames.games, { ...newGame, owner: email }];
        console.log(newGames);

        const res = await fetch('http://localhost:5005/admin/games', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : undefined,
            },
            body: JSON.stringify({"games": newGames})
        })
        if (!res.ok) {
            const error = await res.json();
            console.log(error)
            setError(error.error || "Create game failed");
            return;
        }
        // show game
        setGame({...originalGames, games: newGames});
        setShowModal(false);
        console.log("creation success");
    }
    
    // make a card for each game
    const GameCard = ({game}) => {
        const questionNum = game.questions?.length || 0;
        const thumbnail = game.thumbnail || defaultImage;
        return (
          <div className="game-card">
            <h3>{game.name}</h3>
            <p>Questions: {questionNum}</p>
            <img src={thumbnail} alt="thumbnail" className="game-thumbnail" />
            <p>Total Duration: </p>
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
            <button className="submit-game" type="submit" onClick={() => setShowModal(true)}>Create a new game</button>
            {showModal && (
                <CreateGameModal
                    close={() => setShowModal(false)}
                    create={createGame}  
                />
            )}
        </div>
    );
}

export default Dashboard;