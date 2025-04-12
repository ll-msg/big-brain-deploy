import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCall } from './helper';

function Play() {
    const playerId = localStorage.getItem('playerId');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [curquestion, setcurQuestion] = useState(null);
    const [locked, setLocked] = useState('');
    const [countdown, setCountdown] = useState("");
    const [selectedAnswers, setSelectedAnswers] = useState([]);

    // check session status
    const isStarted = async(e) => {
        const res = await apiCall('GET', `http://localhost:5005/play/${playerId}/status`, null, setError, "Failed to check status");
        setStatus(res.started);
    }

    useEffect(() => {
        const interval = setInterval(() => {
          isStarted();
        }, 2000);
        return () => clearInterval(interval);
      }, [playerId]);      

    // current question
    const getCurQuestion = async(e) => {
        const res = await apiCall('GET', `http://localhost:5005/play/${playerId}/question`, null, setError, "Failed to retrieve current question");
        if (res) {
            setcurQuestion(res.question);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
          getCurQuestion();
        }, 1000);
        return () => clearInterval(interval);
    }, []);
      

    // set countdown
    const countDown = () => {
        const startTime = new Date(curquestion.isoTimeLastQuestionStarted).getTime();
        const limit = curquestion.duration * 1000; 
        const leftTime = Math.max(0, Math.floor((startTime + limit - Date.now()) / 1000));
        setCountdown(leftTime);
        // can not answer after time is up
        if (leftTime === 0) {
            setLocked(true);
        } else {
            setLocked(false);
        }
    };

    useEffect(() => {
        if (!curquestion) return;
        countDown();
        const timer = setInterval(countDown, 1000);
        return () => clearInterval(timer);
    }, [curquestion]);

    // change answer
    const handleAnswer = async(answer) => {
        if (locked) return;
        console.log(answer)
        
        const type = curquestion.type;
        console.log(type)
        let answers = [];
        if (type === 'single choice' || type === 'judgement') {
            answers = [answer];
            console.log(answers)
        } else if (type === 'multiple choice') {
            answers = selectedAnswers.includes(answer) ? selectedAnswers.filter((a) => a !== answer) : [...selectedAnswers, answer];
        }

        setSelectedAnswers(answers);
        console.log(answers)
        // send answer
        const body = {
            "answerIds": answers
        }
        console.log(body);
        const res = await apiCall('PUT', `http://localhost:5005/play/${playerId}/answer`, body, setError, "Failed to send answer");
        console.log(res)
        if (res) {
            console.log("send!")
        }
    }
      
      
    // session not start
    if (!status) return <p>Please wait...</p>;
    
    return (
        <div className="play-container">
            <h2>Question: {curquestion.question}</h2>
            {countdown !== null && (<p>Time left: {countdown} seconds</p>)}
            <ul className="space-y-2 mt-4">
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
        </div>
    )
}

export default Play;

// TODO: add video/image
// timer => 0, show answers and lock the question