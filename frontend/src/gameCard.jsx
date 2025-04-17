import './gamecard.css'
import defaultImage from './assets/default-image.jpg';

function GameCard ({ game, goToQuestions, deleteGame, stopGame, startGame, sessionId, navigate }) {

  const questionNum = game.questions?.length || 0;
  const thumbnail = game.thumbnail || defaultImage;
  const totalDuration = game.questions?.reduce((acc, q) => acc + (q.duration || 0), 0) || 0;

  return (
    <div className="game-card">
      <h3>{game.name}</h3>
      <p className='questions' onClick={() => goToQuestions(game.id)}>Questions: {questionNum}</p>
      <img src={thumbnail} alt="thumbnail" className="game-thumbnail" />
      <p>Total Duration: {totalDuration}</p>
      <button>Edit</button>
      <button onClick={() => deleteGame(game.id)}>Delete</button>
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

export default GameCard;