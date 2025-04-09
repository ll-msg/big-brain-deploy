import React, { useEffect, useState } from 'react';
import { apiCall } from './helper';
import { useNavigate } from 'react-router-dom';
import defaultImage from './assets/default-image.jpg';
import CreateGameModal from './gameModal';
import Modal from './sessionModal';
import './gamecard.css'
import './dashboard.css'

function Dashboard() {
    const [game, setGame] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState("");
    const [isModalopen, setModalopen] = useState(false);


    // retrieve games
    const handleGame = async(e) => {
        //e.preventDefault();
        const data = await apiCall('GET', 'http://localhost:5005/admin/games', null, setError, "Retrieve game data failed");
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

        await apiCall('PUT', 'http://localhost:5005/admin/games', {"games": newGames}, setError, "Create game failed");
        // show game
        setGame({...originalGames, games: newGames});
        setShowModal(false);
        console.log("creation success");
    }
    
    // make a card for each game
    const GameCard = ({game}) => {
        const questionNum = game.questions?.length || 0;
        const thumbnail = game.thumbnail || defaultImage;
        const totalDuration = game.questions?.reduce((acc, q) => acc + (q.limit || 0), 0);

        return (
          <div className="game-card">
            <h3>{game.name}</h3>
            <p className='questions' onClick={() => goToQuestions(game.id)}>Questions: {questionNum}</p>
            <img src={thumbnail} alt="thumbnail" className="game-thumbnail" />
            <p>Total Duration: {totalDuration} </p>
            <button>Edit</button>
            <button>Delete</button>
            {game.active ? (
                <button onClick={() => stopGame(game.id)}>Stop Game</button>
                ) : (
                <button onClick={() => startGame(game.id)}>Start Game</button>
            )}
            {game.active && <button onClick={() => navigate(`/session/${sessionId}`)}>Manage session</button>}
            {game.active && <span className="active-visual">Active</span>}
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

    // go to question list of the game
    const goToQuestions = (gameId) => {
        navigate(`/game/${gameId}`)
    }

    // start a game session
    const startGame = async(gameId) => {
        const body = {"mutationType": "START"};
        const data = await apiCall('POST', `http://localhost:5005/admin/game/${gameId}/mutate`, body, setError, "Start session failed")
        setSessionId(data.data.sessionId);
        setModalopen(true);
        // live update session status to true
        setGame(prev => ({
            games: prev.games.map(g => g.id === gameId ? { ...g, active:true } : g)
        }));
        localStorage.setItem(`session:${data.data.sessionId}:gameId`, gameId)
    }

    // stop a game session
    const stopGame = async(gameId) => {
        const body = {"mutationType": "END"};
        await apiCall('POST', `http://localhost:5005/admin/game/${gameId}/mutate`, body, setError, "End session failed")
        // live update session status to false
        setGame(prev => ({
            games: prev.games.map(g => g.id === gameId ? { ...g, active:false } : g)
        }));
        const confirm = window.confirm("Would you like to view the results?");
        if (confirm) {
            console.log("stop success");
            navigate(`/session/${sessionId}`);
        }
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
            {isModalopen && (
                <Modal onClose={() => setModalopen(false)}>
                    <p>Game started! Session id: {sessionId}</p>
                    <button onClick={() => {navigator.clipboard.writeText(sessionId)}}>Copy Id</button>
                    <button onClick={() => setModalopen(false)}>Close</button>
                </Modal>
            )}
        </div>
    );
}

export default Dashboard;