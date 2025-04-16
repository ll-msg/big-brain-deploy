import React, { useEffect, useState } from 'react';

export async function apiCall(method, url, data=null, setError, errorMsg, auth=true) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
    };
    if (auth && token) {
        headers['Authorization'] = `Bearer ${token}`;
    };
    
    const body = {
        method,
        headers
    };

    if (data) {
        body.body = JSON.stringify(data);
    }
    try {
        const res = await fetch(url, body);
        if (!res.ok) {
            let errorText = await res.text();
            try {
                const error = JSON.parse(errorText);
                setError?.(error.error || errorMsg);
            } catch {
                setError?.(errorMsg || "Unknown error");
            }
            return null;
        }
        const text = await res.text();
        const returnData = text ? JSON.parse(text) : {};
        return returnData;
    } catch (err) {
        console.error("apiCall failed:", err);
        setError?.(errorMsg || err.message);
        return null;
    }
}

export function fileToDataUrl(file) {
    const validFileTypes = [ 'image/jpeg', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        return;
    }
    
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = (e) => {
          reject("READ FAILED");
        };
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

// edit question form
export default function QuestionForm({ mode, questionId, gameId, onSubmit, close }) {
    const [question, setQuestion] = useState('');
    const [questions, setQuestions] = useState('');
    const [type, setType] = useState('single choice');
    const [limit, setLimit] = useState(30);
    const [points, setPoints] = useState(100);
    const [answer, setAnswer] = useState([
        { text: '', correct: false },
        { text: '', correct: false }
    ]);
    const [error, setError] = useState('');

    // for edit question - automatically set up original data 
    useEffect(() => {
        const loadOriginal = async() => {
            const data = await apiCall('GET', 'http://localhost:5005/admin/games', null, setError, 'Failed to load game');
            const game = data.games.find(g => g.id === Number(gameId));
            if (!game) return;

            console.log(game.questions);
            setQuestions(game.questions);

            if (mode === 'edit' && gameId && questionId) {
                const q = game.questions.find(q => q.id === questionId || Number(q.id) === Number(questionId));
                if (!q) return;
                // fill in data
                setQuestion(q.question);
                setType(q.type);
                setLimit(q.duration);
                setPoints(q.points);
                setAnswer(q.answers || []);
            }
        }
        loadOriginal();
    }, [mode, gameId. questionId]);

    const generateQuestionId = (curQuestions) => {
        console.log(curQuestions)
        const ids = curQuestions.map(q => Number(q.id));
        const max_id = ids > 0 ? Math.max(...ids) : 0;
        return (max_id + 1).toString();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(limit);
        const correctAnswers = answer.filter((a) => a.correct).map((a) => a.text.trim());
        const newQuestion = {
            id: mode === 'create' ? generateQuestionId(questions)  : questionId.toString() ,
            question,
            type,
            duration: Number(limit),
            points: Number(points),
            correctAnswers: correctAnswers,
            answers: answer,
        };
        onSubmit(newQuestion);
    };
      
    return (
        <form onSubmit={handleSubmit} className="question-form">
            {error && <p className="error-message">{error}</p>}
            <input type="text" value={question} placeholder='Enter question' onChange={(e) => setQuestion(e.target.value)} />
            <select id="question-type" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="single choice">Single Choice</option>
                <option value="multiple choice">Multiple Choice</option>
                <option value="judgement">Judgement</option>
            </select>
            <input type="number" value={limit} placeholder='Specify time limit' onChange={(e) => setLimit(e.target.value)} />
            <input type="number" value={points} placeholder='Points' onChange={(e) => setPoints(e.target.value)} />
            <div className='answers-input'>
                {answer.map((a, i) => (
                    <div key={i} className="answer-input">
                        <input type="text" value={a.text} placeholder={`Answer ${i + 1}`} onChange={(e) => {
                            const updatedAnswer = [...answer];
                            updatedAnswer[i].text = e.target.value;
                            setAnswer(updatedAnswer);
                        }} required />
                        <input type="checkbox" checked={a.correct}
                            onChange={() => {
                                if (type === 'single choice' || type === 'judgement') {
                                const updatedAnswer = answer.map((ans, index) => ({
                                    ...ans,
                                    correct: index === i
                                }));
                                setAnswer(updatedAnswer);
                                } else {
                                    const updatedAnswer = [...answer];
                                    updatedAnswer[i].correct = !updatedAnswer[i].correct;
                                    setAnswer(updatedAnswer);
                                }
                            }}
                            disabled={type === 'judgement'}/>
                        <button type="button" onClick={() => { if (answer.length > 2) { setAnswer(answer.filter((_, index) => index !== i));}}}>
                            Delete Answer
                        </button>
                    </div>
                ))}
                <button type="button" onClick={() => { if (answer.length < 6) { setAnswer([...answer, { text: '', correct: false }]);}}}>
                    Add Possible Answer
                </button>
            </div>
            <button type="submit">Create</button>
            <button onClick={close}>Cancel</button>
        </form>
    )
}