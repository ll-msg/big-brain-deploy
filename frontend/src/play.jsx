import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from './helper';

function Play() {
  const playerId = localStorage.getItem('playerId');
  const [error, setError] = useState('');
  const [curquestion, setcurQuestion] = useState(null);
  const [locked, setLocked] = useState('');
  const [showAnswer, setShowAnswers] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [lastQuestion, setLastQuestion] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const navigate = useNavigate();

  // check session status
  const isStarted = async() => {
    const res = await apiCall('GET', `http://localhost:5005/play/${playerId}/status`, null, setError, "Failed to check status");
    if (!res) {
      console.log("game already finished yo and nolonger active session")
      return null;
    }
    return res.started;
  }
    
  useEffect(() => {
    const interval = setInterval(() => {
      isStarted();
    }, 1000);
    return () => clearInterval(interval);
  }, [playerId]);   
      

  // current question
  const getCurQuestion = async() => {

    const started = await isStarted();
    const res = await apiCall('GET', `http://localhost:5005/play/${playerId}/question`, null, setError, "Failed to retrieve current question");
        
    if (res === null && started === true) {
      console.log("Game started, but no question ready yet.");
      return;
    }
        
        
    if (res) {
      if (!curquestion || res.question.id !== curquestion.id) {
        setLastQuestion(res.question); 
        setcurQuestion(res.question);
        setSelectedAnswers([]);
        setShowAnswers(false);
        setLocked(false);  
      }
    }

    if (res === null && started === null) {
      console.log("Game finished.");
      setIsFinished(true);
      setLocked(true);
      setShowAnswers(true);
      return;
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getCurQuestion();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isFinished) {
      navigate(`/session/play/${playerId}/result`);
    }
  }, [isFinished, navigate, playerId]);
    
  // get correct answers
  const getCorrectAnswer = async() => {
    const res = await apiCall('GET', `http://localhost:5005/play/${playerId}/answer`, null, setError, "Failed to get correct answers");
    if (res) {
      setCorrectAnswers(res.answerIds);
    }
  }

  useEffect(() => {
    if (showAnswer && curquestion) {
      getCorrectAnswer();
    }
  }, [showAnswer, curquestion]);
      

  // set countdown
  const countDown = () => {
    const startTime = new Date(curquestion.isoTimeLastQuestionStarted).getTime();
    const limit = curquestion.duration * 1000; 
    const leftTime = Math.max(0, Math.floor((startTime + limit - Date.now()) / 1000));
    setCountdown(leftTime);
    // can not answer after time is up
    if (leftTime === 0) {
      setLocked(true);
      setShowAnswers(true);
    } else {
      setLocked(false);
    }
  };

  useEffect(() => {
    if (!lastQuestion) return;
    countDown();
    const timer = setInterval(countDown, 1000);
    return () => clearInterval(timer);
  }, [lastQuestion]);

  // change answer
  const handleAnswer = async(answer) => {
    if (locked) return;
        
    const type = curquestion.type;
    let answers = [];
    if (type === 'single choice' || type === 'judgement') {
      answers = [answer];
    } else if (type === 'multiple choice') {
      answers = selectedAnswers.includes(answer) ? selectedAnswers.filter((a) => a !== answer) : [...selectedAnswers, answer];
    }
    setSelectedAnswers(answers);
    // send answer
    const body = {
      "answers": answers
    }
    await apiCall('PUT', `http://localhost:5005/play/${playerId}/answer`, body, setError, "Failed to send answer", false);
  }

  // load current question
  if (!curquestion) return <p>Please wait for the game to start...</p>;

    
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-start px-4 py-10">
      
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      
      <div className="bg-neutral-800 rounded-xl shadow-lg p-8 w-full max-w-2xl space-y-6">
        <h2 className="text-2xl font-bold text-center">Question: {curquestion.question}</h2>
        {countdown !== null && (<p className="text-center text-yellow-400 font-mono text-lg">Time left: {countdown} seconds</p>)}
        <ul className="space-y-3">
          {curquestion.answers.map((a, i) => (
            <li
              key={i}
              onClick={() => handleAnswer(a.text)}
              className={`border p-3 rounded cursor-pointer transition 
                          ${selectedAnswers.includes(a.text) ? 'bg-green-200' : 'hover:bg-yellow-200'} 
                          ${locked ? 'pointer-events-none opacity-50' : ''}`}
            >
              {a.text}
            </li>
          ))}
        </ul>
        {showAnswer && lastQuestion && correctAnswers.length > 0 && (
          <div className="pt-4 border-t border-gray-600">
            <p className="font-bold text-lg mb-2">Correct Answers: </p>
            <ul className="list-disc list-inside text-green-400 space-y-1">
              {lastQuestion.answers
                .filter(a => correctAnswers.includes(a.text))
                .map((a, i) => (
                  <li key={i}>{a.text}</li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Play;

// TODO: add video/image
// timer => 0, show answers and lock the question