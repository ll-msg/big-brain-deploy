import React, { useEffect, useState } from 'react';
import { fileToDataUrl } from './helper';

function CreateQuestionModal({ close, create }) {
    const [question, setQuestion] = useState('');
    const [type, setType] = useState('single');
    const [limit, setLimit] = useState('');
    const [points, setPoints] = useState('');
    const [answer, setAnswer] = useState([{ text: '', correct: false }, { text:'', correct: false }]);
    const uniqueId = Math.floor(Date.now() + Math.random() * 1000);

    const handleSubmit = () => {
        const newQuestion = ({
            id: uniqueId,
            type: type,
            question: question,
            limit: limit,
            points: points,
            answers: answer
        });
        create(newQuestion);
    }

    return (
        <div className="modal-container">
            <div className="modal-header">
                <h4 className="modal-title">Create a new game</h4>
            </div>
            <div className="modal-body">
                <input type="text" value={question} placeholder='Enter question' onChange={(e) => setQuestion(e.target.value)} />
                <select id="question-type" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="single">Single Choice</option>
                    <option value="multiple">Multiple Choice</option>
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
                                    if (type === 'single' || type === 'judgement') {
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
            </div>
            <div className="modal-button">
                <button onClick={handleSubmit}>Create</button>
                <button onClick={close}>Cancel</button>
            </div>
        </div>
    );
}

export default CreateQuestionModal;