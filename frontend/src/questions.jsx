import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiCall } from './helper';
import CreateQuestionModal from './questionModal';

function Questions() {
    const { gameId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);

    const loadQuestions = async(e) => {
        const data = await apiCall('GET', 'http://localhost:5005/admin/games', null, setError, "Retrieve game data failed");
        const curGame = data.games.find((element) => element.id === Number(gameId));
        setQuestions(curGame.questions || []);
    }

    const createQuestion = async(newQuestion) => {
        // get all games and append new question
        const games = await apiCall('GET', 'http://localhost:5005/admin/games', null, setError, "Retrieve game data failed");
        const updatedGames = games.games.map(game => {
            if (game.id === Number(gameId)) {
                const updatedQuestions = [...(game.questions) || [], newQuestion];
                return {...game, questions: updatedQuestions};
            } else {
                return game;
            }
        });

        // update games
        apiCall('PUT', 'http://localhost:5005/admin/games', {"games": updatedGames}, setError, "Update game data failed")
    
        console.log("create success!")
        // live update
        setQuestions(prev => [...prev, newQuestion])
        setShowModal(false);
    };

    // TODO: update question

    // TODO: delete question
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
        apiCall('PUT', 'http://localhost:5005/admin/games', {"games": updatedGames}, setError, "Delete game data failed")
        console.log("delete success!")
        setQuestions(prev => prev.filter(q => q.id !== questionId));
    }


    useEffect(() => {
        loadQuestions();
    }, [gameId]);


    return (
    <div className='question-list'>
        {error && <p className="error-message">{error}</p>}
        {questions.map((q, i) => (
            <div key={i} className="game-card">
                <p>{q.type}</p>
                <p><strong>Q{i + 1}:</strong> {q.question}</p>
                <p>Duration: {q.limit}</p>
                <p>Points: {q.points}</p>
                <button>Edit</button>
                <button onClick={() => deleteQuestion(q.id)}>Delete</button>
            </div>
        ))}
        <button className="submit-question" type="submit" onClick={() => setShowModal(true)}>Create a new question</button>
        {showModal && (
            <CreateQuestionModal
                close={() => setShowModal(false)}
                create={createQuestion}  
            />
        )}
    </div>
    );
};

export default Questions;
