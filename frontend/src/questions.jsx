import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCall, convertYouTubeUrl } from './helper';
import CreateQuestionModal from './questionModal';

function Questions() {
  const { gameId } = useParams();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [game, setGame] = useState(null);
  const navigate = useNavigate();

  const loadQuestions = async() => {
    // start to load the questions
    setLoading(true);
    const data = await apiCall('GET', 'http://localhost:5005/admin/games', null, setError, "Retrieve game data failed");
    // handle situation when game data has not been added yet
    if (!data) return;
    const curGame = data.games.find((element) => element.id === Number(gameId));
    if (!curGame) {
      setLoading(false);
      return;
    }
    setGame(curGame);
    setQuestions(curGame.questions || []);
    setLoading(false);
  }

  const createQuestion = async(newQuestion) => {
    // get all games and append new question
    const games = await apiCall('GET', 'http://localhost:5005/admin/games', null, setError, "Retrieve game data failed");
    const updatedGames = games.games.map(game => {
      if (game.id === Number(gameId)) {
        const updatedQuestions = [...(game.questions || []), newQuestion];
        return {...game, questions: updatedQuestions};
      } else {
        return game;
      }
    });

    // update games
    console.log(updatedGames)
    const res = await apiCall('PUT', 'http://localhost:5005/admin/games', {"games": updatedGames}, setError, "Update game data failed")
    if (!res) return;
    console.log("create success!")
    // live update
    //setQuestions(prev => [...prev, newQuestion])
    await loadQuestions();
    setShowModal(false);
  };


  const deleteQuestion = async(questionId) => {
    const games = await apiCall('GET', 'http://localhost:5005/admin/games', null, setError, "Retrieve game data failed");
    const updatedGames = games.games.map(game => {
      if (game.id === Number(gameId)) {
        return {
          ...game,
          questions: (game.questions || []).filter(q => q.id !== questionId)
        };
      }
      return game;
    });

    // delete question and update games
    const res = await apiCall('PUT', 'http://localhost:5005/admin/games', {"games": updatedGames}, setError, "Delete question failed")
    if (!res) return;
    console.log("delete success!")
    setQuestions(prev => prev.filter(q => q.id !== questionId));
  }


  useEffect(() => {
    loadQuestions();
  }, [gameId]);


  return (
    <div className="question-list flex flex-col items-center px-4 py-8 space-y-8">
      {error && <p className="error-message">{error}</p>}
      
      <div className="flex flex-wrap justify-center gap-6 max-w-screen-xl">
        {loading ? (
          <p>Loading questions now... Please wait for a moment</p>
        ) : questions.length === 0 ? (
          <p>No questions yet. Click below to create one!</p>
        ) : (
          questions.map((q, i) => (
            <div key={i} className="w-100 mt-10 ml-10 bg-black text-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition duration-200 space-y-3">
              <p className="text-sm text-gray-400 uppercase">{q.type}</p>
              <p className="text-lg font-semibold"><strong>Q{i + 1}:</strong> {q.question}</p>
              {q.mediaUrl && (
                <div className="rounded overflow-hidden mt-2">
                  <iframe src={convertYouTubeUrl(q.mediaUrl)} className="w-full h-64 rounded" allowFullScreen title={`Video for question ${q.id}`} />
                </div>
              )}
              {q.mediaImage && (
                <div className="mt-2">
                  <img src={q.mediaImage} alt={`Image for question ${q.id}`} className="rounded max-w-full max-h-64 object-contain"/>
                </div>
              )}
              <p className="text-sm text-gray-300">Duration: {q.duration}</p>
              <p className="text-sm text-gray-300">Points: {q.points}</p>
              <div className="flex gap-4 pt-2">
                <button onClick={() => navigate(`/game/${gameId}/question/${q.id}`)} className="px-4 py-1 text-sm rounded bg-blue-500 hover:bg-blue-600">Edit</button>
                <button onClick={() => deleteQuestion(q.id)} className="px-4 py-1 text-sm rounded bg-red-600 hover:bg-red-700">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && (
        <>
          <button type="submit" onClick={() => setShowModal(true)} className="ml-10 mt-6 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-200">
              Create a new question
          </button>
          {showModal && (
            <CreateQuestionModal
              close={() => setShowModal(false)}
              create={createQuestion}
              gameId={gameId}
              game={game}
            />
          )}
        </>
      )}
    </div>      
  );
};

export default Questions;
