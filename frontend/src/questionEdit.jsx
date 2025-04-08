import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCall } from './helper';
import QuestionForm from './helper';

function QuestionEdit() {
    const { gameId, questionId } = useParams();
    console.log(questionId)
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // get new question
    const updateQuestion = async(updatedQuestion) => {
        const data = await apiCall('GET', 'http://localhost:5005/admin/games', null, setError, "Retrieve game data failed");
        const updatedGames = data.games.map(game => {
            // find the game
            if (game.id === Number(gameId)) {
                const updatedQuestions = game.questions.map(q =>
                    q.id === questionId ? updatedQuestion : q
                );
                return { ...game, questions: updatedQuestions };
            }
            return game
        });
        // update question
        await apiCall('PUT', 'http://localhost:5005/admin/games', { games: updatedGames }, setError, "Edit question failed");
        // go back to question page
        navigate(`/game/${gameId}`);
    }

    return (
        <div className="edit-question">
            {error && <p className="error-message">{error}</p>}
            <QuestionForm mode="edit" questionId={questionId} gameId={gameId} onSubmit={updateQuestion}/>
        </div>
    )
    
}

export default QuestionEdit;