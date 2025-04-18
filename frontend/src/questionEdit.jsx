import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCall } from './helper';
import QuestionForm from './questionForm';

function QuestionEdit() {
  const { gameId, questionId } = useParams();
  const [error, setError] = useState('');
  const [game, setGame] = useState('');
  const navigate = useNavigate();

  // load original data
  useEffect(() => {
    const loadGame = async () => {
      const data = await apiCall('GET', 'http://localhost:5005/admin/games', null, setError, 'Failed to load game');
      const curGame = data.games.find(g => Number(g.id) === Number(gameId));
      if (!curGame) return;
      setGame(curGame);
    };
    loadGame();
  }, [gameId]);

  // get new question
  const updateQuestion = async(updatedQuestion) => {
    const data = await apiCall('GET', 'http://localhost:5005/admin/games', null, setError, "Retrieve game data failed");
    const updatedGames = data.games.map(game => {
      // find the game
      if (game.id === Number(gameId)) {
        const updatedQuestions = game.questions.map(q =>
          q.id === questionId ? updatedQuestion : q
        );
        return { ...game, questions: updatedQuestions };
      }
      return game
    });
    // update question
    await apiCall('PUT', 'http://localhost:5005/admin/games', { games: updatedGames }, setError, "Edit question failed");
    // go back to question page
    navigate(`/game/${gameId}`);
  }

  return (
    <div className="edit-question">
      {error && <p className="error-message">{error}</p>}
      <QuestionForm mode="edit" questionId={questionId} gameId={gameId} game={game} onSubmit={updateQuestion} close={() => navigate(-1)}/>
    </div>
  )
    
}

export default QuestionEdit;