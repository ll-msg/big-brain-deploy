import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCall } from './helper';

function Session() {
  const [error, setError] = useState('');
  const { sessionId } = useParams();
  const gameId = localStorage.getItem(`session:${sessionId}`);
  const [results, setResults] = useState(null);
  const [countdown, setCountdown] = useState("");
  const navigate = useNavigate();
  let current = "";

  const checkSession = async() => {
    // get current status of the game session
    const res = await apiCall('GET', `http://localhost:5005/admin/session/${sessionId}/status`, null, setError, "Retrieve status failed");
    setResults(res.results);
  }

  // calculate countdown timw
  const countDown = () => {
    const startTime = new Date(results.isoTimeLastQuestionStarted).getTime();
    const limit = results.questions[results.position].duration * 1000;
    const leftTime = Math.max(0, Math.floor((startTime + limit - Date.now()) / 1000));
    setCountdown(leftTime);
  }

  // show questions
  useEffect(() => {
    checkSession();
  }, [sessionId]);

  // show countdown
  useEffect(() => {
    if (!results || results.position === -1) return;
    
    countDown();
    const timer = setInterval(countDown, 1000);
    return () => clearInterval(timer);
  }, [results]);

  // wait to load results
  if (!results) {
    return (<p>Loading results</p>);
  }
  // when there's no current questions
  if (results.active === false) {
    return (<p>The game has not started yet</p>);
  }
  if (results.position !== -1) {
    current = results.questions[results.position];
  }

  // advance question
  const advanceQuestion = async() => {
    // advance to last question then stop session
    let isLast = false;
    if (results.position === results.questions.length - 1) isLast = true;
    if(isLast) {
      await(stopSession());
      return;
    } 
        
    const body = {"mutationType": "ADVANCE"};
    await apiCall('POST', `http://localhost:5005/admin/game/${gameId}/mutate`, body, setError, "Advance session failed");
    await checkSession();
  }

  // stop session
  const stopSession = async() => {
    const body = {"mutationType": "END"};
    await apiCall('POST', `http://localhost:5005/admin/game/${gameId}/mutate`, body, setError, "End session failed")
    localStorage.removeItem(`session:${sessionId}`);
    // navigate to session result
    navigate(`/session/${sessionId}/result`)
    console.log("success stop session");
  }


  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-start px-6 py-10 space-y-6">
      
      {error && <p className="text-red-400 text-sm">{error}</p>}
      
      {results.position === -1 ? (
        <div className="bg-neutral-800 rounded-xl p-6 shadow-lg w-full max-w-lg space-y-4 text-center">
          <p className="text-xl font-semibold">The game has not started yet.</p>
          <div className="flex justify-center gap-4 mt-4">
            <button onClick={advanceQuestion} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-semibold transition">Advance</button>
            <button onClick={stopSession} className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white font-semibold transition">Stop Session</button>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-800 rounded-xl p-6 shadow-lg w-full max-w-xl space-y-6">
          <h3 className="text-2xl font-bold text-center">Question {results.position + 1}</h3>
          <p className="text-lg text-center">{current.question}</p>
          
          <ul className="space-y-2">
            {current.answers.map((a, i) => (
              <li key={i} className="bg-neutral-700 p-3 rounded text-white text-sm border border-neutral-600">{a.text}</li>
            ))}
          </ul>

          {countdown !== null && (<p className="text-center text-yellow-400 font-mono text-lg">Time left: {countdown} seconds</p>)}
          
          <div className="flex justify-center gap-4 pt-4">
            <button onClick={advanceQuestion} className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white font-semibold transition">Next Question</button>
            <button onClick={stopSession} className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white font-semibold transition">Stop Session</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Session;

// 1. show current question
// 2. have an advance button allowing user to next question / have an stop session button to get result
// 3. if all questions are over
// 4. get result