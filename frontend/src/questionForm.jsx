import { useEffect, useState } from 'react';
import { apiCall } from './helper';
import { fileToDataUrl } from './helper';

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
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaImage, setMediaImage] = useState('');

  
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
        setMediaUrl(q.mediaUrl || '');
        setMediaImage(q.mediaImage || '');

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

  const handleImg = async(e) => {
      const img = e.target.files[0];
      if(!img) return;
      const encodedImg = await fileToDataUrl(img);
      setMediaImage(encodedImg);
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const correctAnswers = answer.filter((a) => a.correct).map((a) => a.text.trim());
    const newQuestion = {
      id: mode === 'create' ? generateQuestionId(questions)  : questionId.toString() ,
      question,
      type,
      mediaUrl,
      mediaImage,
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
      <label>Attach YouTube Video URL (optional):</label>
      <input type="text" value={mediaUrl} placeholder="https://www.youtube.com/..." onChange={(e) => setMediaUrl(e.target.value)} />
      <input type="file" accept="image/*" onChange={handleImg} />
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