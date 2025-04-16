import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCall } from './helper';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

function Result() {
    const { sessionId } = useParams();
    const [sessionResult, setSessionResult] = useState([]);
    const [error, setError] = useState('');
    const [points, setPoints] = useState([]);
    const [scores, setScores] = useState([]);
    const [correctData, setCorrectData] = useState([]);
    const [avgTimeData, setAvgTimeData] = useState([]);


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

    // calculate data needed for result chart
    const calculateResult = async(result) => {
        // assign array with answers total number
        const num = result[0]?.answers.length || 0;
        const countCorrects = Array(num).fill(0);
        const countTotal = Array(num).fill(0);
        const times = Array(num).fill(0);
        const countTime = Array(num).fill(0);

        result.forEach(player => {
            player.answers.forEach((a, i) => {
                // only calculate answered questions
                if (a.answeredAt && a.questionStartedAt) {
                    // calculate percentage data
                    countTotal[i]++;
                    if (a.correct) {
                        countCorrects[i]++;
                    }
                    // calculate average response time data
                    const start = new Date(a.questionStartedAt).getTime();
                    const end = new Date(a.answeredAt).getTime();
                    const responseTime = (end - start) / 1000;
                    times[i] += responseTime;
                    countTime[i]++;
                }
            });
        });

        // calculate percentage
        const percentages = countCorrects.map((c, i) =>
            countTotal[i] > 0 ? (c / countTotal[i]) * 100 : 0
        );        
        // calculate average time
        const avgTimes = times.map((t, i) => 
            countTime[i] > 0 ? (t / countTime[i]) : 0
        )

        return { percentages, avgTimes };
        
    }


    useEffect(() => {
        const loadData = async () => {
            const points = await getPoints();
            const result = await getSessionResult();
            if (points && result) {
                await calculateScore(result, points);
            }
            // for charts
            const { percentages, avgTimes } = await calculateResult(result);

            const finalCorrectData = percentages.map((p, i) => ({
                question: `Q${i + 1}`,
                percentage: p
            }));

            const finalTimeData = avgTimes.map((t, i) => ({
                question: `Q${i + 1}`,
                time: t
            }));

            setCorrectData(finalCorrectData);
            setAvgTimeData(finalTimeData);
        };
        if (sessionId) loadData();
    }, [sessionId]);


    return (
        <div className="result-container">
            {error && <p className="error-message">{error}</p>}

            <div className="relative overflow-x-auto">
                <table className="w-2/3 mx-auto my-30 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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

                <br></br>
                <br></br>
                <div className="w-2/3 mx-auto h-150 my-30">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={correctData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="question" />
                        <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} />
                        <Tooltip />
                        <Bar dataKey="percentage" fill="#008000" />
                    </BarChart>
                    </ResponsiveContainer>
                    <h2 className="text-lg font-semibold mb-2 text-center">Correctness Rate per Question</h2>
                </div>
                    
                <div className="w-2/3 mx-auto h-150 my-30">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={avgTimeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="question" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="time" stroke="#008000" />
                        </LineChart>
                    </ResponsiveContainer>
                    <h2 className="text-lg font-semibold mb-2 text-center">Average Answer Time per Question</h2>
                </div>

            </div>
        </div>
    )
}
export default Result;