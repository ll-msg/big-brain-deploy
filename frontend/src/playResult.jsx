import { apiCall } from "./helper";
import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function PlayerResult() {
  const [error, setError] = useState('');
  const { playerId } = useParams();
  const [result, setResult] = useState([]);
  const [finalScore, setfinalScore] = useState(0);
  const location = useLocation();
  const pointsList = location.state?.pointsList || [];

  const getPlayerResult = async() => {
    const res = await apiCall('GET', `http://localhost:5005/play/${playerId}/results`, null, setError, 'Failed to retrieve player results');
    let finalPoints = 0;
    const playerResult = res.map((r, i) => {
      const start = new Date(r.questionStartedAt).getTime();
      const end = new Date(r.answeredAt).getTime();
      if (r.correct) finalPoints += pointsList[i];
      return {
        question: i + 1,
        correct: r.correct,
        timeTaken: Math.round((end - start) / 1000),
      }
    })
    setfinalScore(finalPoints);
    setResult(playerResult);
  }

  useEffect(() => {
    getPlayerResult();
  }, [playerId]);  

  const totalCorrect = result.filter(r => r.correct).length;
  
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-start px-4 py-10">
      
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      
      <div className="bg-neutral-800 rounded-xl shadow-lg w-full max-w-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">Performance Summary</h2>
        <p className="text-center text-lg">You got {totalCorrect} / {result.length} questions correct.</p>
        <p className="text-center text-lg">Your final score is: {finalScore}</p>
        <ul className="space-y-3">
          {result.map((p, i) => (
            <li key={i}>
              
              <p className="font-semibold">
                Question {p.question}{' '}
                <span className={p.correct ? 'text-green-400' : 'text-red-400'}>
                  {p.correct ? 'Correct' : 'Wrong'}
                </span>
              </p>

              <p className="text-sm text-gray-300 mt-1">Response Time: {p.timeTaken}s</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PlayerResult;