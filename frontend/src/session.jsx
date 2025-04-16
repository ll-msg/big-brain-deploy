import React, { useEffect, useState } from 'react';
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

    const checkSession = async(e) => {
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
        return (<p>The game hasn't started yet</p>);
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
        <div className="session-container">
            {error && <p className="error-message">{error}</p>}
            {results.position === -1 ? (
                <>
                    <p>The game hasn't started yet.</p>
                    <button onClick={advanceQuestion}>Advance</button>
                    <br />
                    <button onClick={stopSession}>Stop Session</button>
                </>
                ) : (
                <>
                    <h3>Question {results.position + 1}</h3>
                    <p>{current.question}</p>
                    <ul>
                    {current.answers.map((a, i) => (
                        <li key={i}>{a.text}</li>
                    ))}
                    </ul>
                    {countdown !== null && (<p>Time left: {countdown} seconds</p>)}
                    <button onClick={advanceQuestion}>Next Question</button>
                    <button onClick={stopSession}>Stop Session</button>
                </>
            )}
        </div>
    )
}

export default Session;

// 1. show current question
// 2. have an advance button allowing user to next question / have an stop session button to get result
// 3. if all questions are over
// 4. get result