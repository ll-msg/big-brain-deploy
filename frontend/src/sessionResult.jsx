import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCall } from './helper';

function Result() {
    const { sessionId } = useParams();
    const [sessionResult, setSessionResult] = useState([]);
    const [error, setError] = useState('');
    const [points, setPoints] = useState([]);
    const [scores, setScores] = useState([]);

    const getSessionResult = async(e) => {
        // get result of current session
        const res = await apiCall('GET', `http://localhost:5005/admin/session/${sessionId}/results`, null, setError, "Retrieve session result failed");
        if (!res) return;
        setSessionResult(res.results);
        return res.results;
    }

    // get question points
    const getPoints = async(e) => {
        // get all question points
        const res = await apiCall('GET', `http://localhost:5005/admin/games`, null, setError, "Retrieve session result failed");
        const questionPoints = res.games[0]?.questions.map(q => q.points) || [];
        setPoints(questionPoints);
        return questionPoints;
    }

    // calculate scores
    const calculateScore = async(result, points) => {
        const playerScores = result.map(player => {
            const score = player.answers.reduce((total, a, i) => {
                return total + (a.correct ? (points[i] || 0) : 0);
            }, 0);
            return {
                name: player.name,
                score: score
            };
        });
        // sort out the top 5 players
        const topPlayers = playerScores.sort((a, b) => b.score - a.score).slice(0, 5);
        setScores(topPlayers);
    };

    useEffect(() => {
        const loadData = async () => {
            const points = await getPoints();
            const result = await getSessionResult();
            if (points && result) {
                await calculateScore(result, points);
            }
        };
        if (sessionId) loadData();
    }, [sessionId]);


    return (
        <div className="result-container">
            {error && <p className="error-message">{error}</p>}

            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3"> Player </th>
                            <th scope="col" className="px-6 py-3"> Score </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessionResult.map((r, i) => {
                            const found = scores.find(s => s.name === r.name);
                            const playerScore = found ? found.score : '...';                        
                            return (
                                <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                    <td className="px-6 py-4">
                                        {r.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {playerScore}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default Result;