import { useEffect, useState } from 'react';
import { apiCall } from './helper';
import { useNavigate } from 'react-router-dom';
import CreateGameModal from './gameModal';
import Modal from './sessionModal';
import GameCard from './gameCard';

function Dashboard() {
  const [game, setGame] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState("");
  const [isModalopen, setModalopen] = useState(false);


  // retrieve games
  const handleGame = async() => {
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

    console.log(newGames);

    const res = await apiCall('PUT', 'http://localhost:5005/admin/games', {"games": newGames}, setError, "Create game failed");
    setShowModal(false);
    if (!res) return;
    // show game
    setGame({...originalGames, games: newGames});
    console.log("creation success");
  }

  // delete a game
  const deleteGame = async(gameId) => {
    const data = await apiCall('GET', 'http://localhost:5005/admin/games', null, setError, "Retrieve game data failed");
    if (!data) {
      setError("Games not found");
      return;
    };
    const updatedGames = data.games.filter((g) => Number(g.id) !== Number(gameId));
    const res = await apiCall('PUT', 'http://localhost:5005/admin/games', {"games": updatedGames}, setError, "Failed to delete games");
    if (!res) return;
    const updated_data = await apiCall('GET', 'http://localhost:5005/admin/games', null, setError, "Retrieve game data failed");
    setGame(updated_data);
    console.log('delete success');
  }

    
  // show all the games
  const renderGameList = () => {
    if (!game.games || game.games.length === 0) {
      return <p>Currently no games</p>
    }
    return game.games.map((game) => (
      <GameCard
        key={game.id}
        game={game}
        goToQuestions={goToQuestions}
        deleteGame={deleteGame}
        startGame={startGame}
        stopGame={stopGame}
        navigate={navigate}
      />
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
    localStorage.setItem(`session:${data.data.sessionId}`, gameId)
    localStorage.setItem(`game:${gameId}:sessionId`, data.data.sessionId);
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


