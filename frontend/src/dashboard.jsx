import { useEffect, useState } from 'react';
import { apiCall } from './helper';
import { useNavigate } from 'react-router-dom';
import CreateGameModal from './gameModal';
import Modal from './sessionModal';
import GameCard from './gameCard';
import EditGameModal from './gameEdit';

function Dashboard() {
  const [game, setGame] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState("");
  const [isModalopen, setModalopen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

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

  // edit a game
  const editGame = (game) => {
    setSelectedGame(game);
    setEditModalOpen(true);
  }

  const updateGame = async (updatedGame) => {
    const data = await apiCall('GET', 'http://localhost:5005/admin/games', null, setError, "Failed to get games");
    const updatedGames = data.games.map((g) => {
      console.log(g.id === updatedGame.id)
      console.log(updatedGame.id)
      return Number(g.id) === Number(updatedGame.id) ? updatedGame : g
    });
    console.log(updatedGames)
    const res = await apiCall('PUT', 'http://localhost:5005/admin/games', { games: updatedGames }, setError, "Failed to update game");
    if (res) {
      setGame({ ...data, games: updatedGames });
      console.log('Game updated successfully');
    }
  };

    
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
        editGame={editGame}
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
      const sid = localStorage.getItem(`game:${gameId}:sessionId`);
      localStorage.removeItem(`game:${gameId}:sessionId`);
      console.log("stop success");
      navigate(`/session/${sid}`);
    }
  }

    
  useEffect(() => {
    handleGame();
  }, [])

  return (
    <div className="game-container flex flex-col items-center px-4 py-8 space-y-8">

      {error && <p className="error-message">{error}</p>}

      <div className="game-list flex flex-wrap justify-center gap-6">
        {renderGameList()}
      </div>

      <button type="submit" onClick={() => setShowModal(true)} className="ml-10 mt-6 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-200">Create a new game</button>
      
      {showModal && (
        <CreateGameModal
          close={() => setShowModal(false)}
          create={createGame}  
        />
      )}

      {isModalopen && (
        <Modal onClose={() => setModalopen(false)}>
          <div className="bg-white text-black rounded-xl shadow-lg w-full max-w-md p-6 space-y-5">
            <p className="text-2xl font-semibold text-center">Game started </p>
            <div className="text-center space-y-2">
              <p className="text-gray-700">Session ID:</p>
              <p data-testid="session-id" className="text-lg font-mono font-semibold bg-gray-100 px-4 py-2 rounded"> {sessionId} </p>
            </div>
            <div className="flex justify-center gap-4 pt-4">
              <button onClick={() => {navigator.clipboard.writeText(`${window.location.origin}/session/join?sessionId=${sessionId}`)}} data-testid="copy-button" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Copy Id</button>
              <button onClick={() => setModalopen(false)} data-testid="close-button" className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition">Close</button>
            </div>
          </div>
        </Modal>
      )}

      {editModalOpen && selectedGame && (
        <EditGameModal
          game={selectedGame}
          close={() => setEditModalOpen(false)}
          update={updateGame}
        />
      )}

    </div>
  );
}

export default Dashboard;


