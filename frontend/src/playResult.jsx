import { apiCall } from "./helper";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function PlayerResult() {
  const [error, setError] = useState('');
  const { playerId } = useParams();
  const [result, setResult] = useState([]);

  const getPlayerResult = async() => {
    const res = await apiCall('GET', `http://localhost:5005/play/${playerId}/results`, null, setError, 'Failed to retrieve player results');
    const playerResult = res.map((r, i) => {
      const start = new Date(r.questionStartedAt).getTime();
      const end = new Date(r.answeredAt).getTime();
      return {
        question: i + 1,
        correct: r.correct,
        timeTaken: Math.round((end - start) / 1000),
      }
    })
    setResult(playerResult);
  }

  useEffect(() => {
    getPlayerResult();
  }, [playerId]);  

  const totalCorrect = result.filter(r => r.correct).length;
  
  return (
    <div className="player-result">
      {error && <p className="error-message">{error}</p>}
      <h2>Performance Summary</h2>
      <p>You got {totalCorrect} / {result.length} questions correct.</p>
      <ul className="mt-4 space-y-2">
        {result.map((p, idx) => (
          <li key={idx}>
            Question {p.question}: {p.correct ? 'Correct' : 'Wrong'}, took you {p.timeTaken}s
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlayerResult;

// TODO: get points list of questions