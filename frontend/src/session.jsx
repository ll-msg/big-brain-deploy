import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCall } from './helper';

function Result() {
    const [error, setError] = useState('');
    const { sessionId } = useParams();
    const [results, setResults] = useState(null);

    useEffect(() => {
        const checkSession = async(e) => {
            // get current status of the game session
            const res = await apiCall('GET', `http://localhost:5005/admin/session/${sessionId}/status`, null, setError, "Retrieve status failed");
            setResults(res.results);
        }
        checkSession();
    }, [sessionId]);

    // wait to load results
    if (!results) {
        return (<p>Loading results</p>);
    }
    // when there's no current questions
    if (results.active === false) {
        return (<p>The game hasn't started yet</p>);
    }
    if (results.position !== -1) {
        const current = results.questions[results.position]
    }

    // advance question
    const advanceQuestion = () => {
        console.log("1")
    }

    // stop session
    const stopSession = () => {
        console.log("2")
    }

    return (
        <div className="session-container">
            {error && <p className="error-message">{error}</p>}
            {results.position === -1 ? (
                <>
                    <p>The game hasn't started yet.</p>
                    <button onClick={advanceQuestion}>Advance</button>
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
                    <button onClick={advanceQuestion}>Next</button>
                    <button onClick={stopSession}>Stop Session</button>
                </>
            )}
        </div>
    )
}

export default Result;

// 1. show current question
// 2. have an advance button allowing user to next question / have an stop session button to get result
// 3. if all questions are over
// 4. get result