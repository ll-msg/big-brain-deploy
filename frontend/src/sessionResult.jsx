import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiCall } from './helper';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

function Result() {
  const { sessionId } = useParams();
  const [sessionResult, setSessionResult] = useState([]);
  const [error, setError] = useState('');
  const [scores, setScores] = useState([]);
  const [correctData, setCorrectData] = useState([]);
  const [avgTimeData, setAvgTimeData] = useState([]);

  // find current game for getting question points
  // TODO: might change based on spec?
  const findGameIdBySessionId = (sessionId) => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('game:') && key.endsWith(':sessionId')) {
        const storedSessionId = localStorage.getItem(key);
        if (storedSessionId === sessionId) {
          const gameId = key.split(':')[1];
          return Number(gameId);
        }
      }
    }
    return null;
  };
  
  const getSessionResult = async() => {
    // get result of current session
    const res = await apiCall('GET', `http://localhost:5005/admin/session/${sessionId}/results`, null, setError, "Retrieve session result failed");
    if (!res) return;
    setSessionResult(res.results);
    return res.results;
  }

  // get question points
  const getPoints = async() => {
    const gameId = findGameIdBySessionId(sessionId);
    // get all question points
    const res = await apiCall('GET', `http://localhost:5005/admin/games`, null, setError, "Retrieve session result failed");
    const game = res.games.find(g => g.id === gameId);
    const questionPoints = game?.questions?.map(q => q.points) || [];
    return questionPoints;
  }

  // calculate scores
  const calculateScore = async(result, points) => {
    const playerScores = result.map(player => {
      const score = player.answers.reduce((total, a, i) => {
        console.log(points)
        console.log(points[i])
        console.log(total + (a.correct ? (points[i] || 0) : 0))
        return total + (a.correct ? (points[i] || 0) : 0);
      }, 0);
      console.log(score)
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
    <div className="min-h-screen bg-neutral-900 text-white px-4 py-10">
      {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

      <div className="max-w-4xl mx-auto space-y-12">

        <div className="bg-neutral-800 rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-center mb-4"> Player Scores</h2>
          <div className="overflow-x-auto rounded">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-neutral-700 text-gray-400">
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
                    <tr key={i} className="bg-neutral-900 border-b border-neutral-700 hover:bg-neutral-800 transition">
                      <td className="px-6 py-4">{r.name}</td>
                      <td className="px-6 py-4">{playerScore}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        

        <div className="bg-neutral-800 rounded-xl shadow-md p-6">
          <div className="w-full h-64">
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
        </div>

        <div className="bg-neutral-800 rounded-xl shadow-md p-6">             
          <div className="w-full h-64">
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
    </div>
  )
}
export default Result;