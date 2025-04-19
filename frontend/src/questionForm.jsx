import { useEffect, useState } from 'react';
import { apiCall } from './helper';
import { fileToDataUrl } from './helper';

// edit question form
export default function QuestionForm({ mode, questionId, gameId, game, onSubmit, close }) {
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useState('');
  const [type, setType] = useState('single choice');
  const [limit, setLimit] = useState(30);
  const [points, setPoints] = useState(100);
  const [answer, setAnswer] = useState([
    { text: '', correct: false },
    { text: '', correct: false }
  ]);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaImage, setMediaImage] = useState('');
  
  // for edit question - automatically set up original data 
  useEffect(() => {
    if (!game) return;
   
    if (mode === 'edit' && gameId && questionId) {
      const q = game.questions.find(q => q.id === questionId || Number(q.id) === Number(questionId));
      if (!q) return;
      // fill in data
      console.log(q)
      setQuestion(q.question);
      setType(q.type);
      setLimit(q.duration);
      setPoints(q.points);
      setAnswer(q.answers || []);
      setMediaUrl(q.mediaUrl || '');
      setMediaImage(q.mediaImage || '');

    }
  }, [mode, gameId, questionId, game]);
  
  const generateQuestionId = () => {
    return (Date.now() + Math.floor(Math.random() * 1000)).toString();
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
    const hasOneChecked = answer.some(a => a.correct);
    if (!hasOneChecked) {
      alert("Please select at least one correct answer.");
      return;
    }
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

  // judgement question only have two answers true or false
  useEffect(() => {
    if (type === 'judgement') {
      setAnswer([
        { text: 'True' },
        { text: 'False' }
      ]);
    }
  }, [type]);
        
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

        <form onSubmit={handleSubmit} className="bg-white text-black rounded-xl shadow-lg w-full max-w-2xl p-6 space-y-5 z-10">
          
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">Create a new question</h4>
            <button onClick={close} type="button" className="text-gray-500 hover:text-black text-xl">&times;</button>
          </div>
          
          <input type="text" value={question} placeholder='Enter question' onChange={(e) => setQuestion(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2" required/>
          
          <select id="question-type" value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2" required>
            <option value="single choice">Single Choice</option>
            <option value="multiple choice">Multiple Choice</option>
            <option value="judgement">Judgement</option>
          </select>
          
          <div className="flex gap-4">
            <input type="number" value={limit} placeholder='Specify time limit' onChange={(e) => setLimit(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2" required/>
            <input type="number" value={points} placeholder='Points' onChange={(e) => setPoints(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2" required/>
          </div>
          
          <label>Attach YouTube Video URL (optional):</label>
          <input type="text" value={mediaUrl} placeholder="https://www.youtube.com/..." onChange={(e) => setMediaUrl(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2"/>
          
          <label htmlFor="image-upload">Attach Question Image (optional): </label>
          <input id="image-upload" type="file" accept="image/*" onChange={handleImg} />
          
          <div className="space-y-4">
            {answer.map((a, i) => (
              <div key={i} className="flex items-center gap-3">

                <input type="text" value={a.text} placeholder={`Answer ${i + 1}`} onChange={(e) => {
                  const updatedAnswer = [...answer];
                  updatedAnswer[i].text = e.target.value;
                  setAnswer(updatedAnswer);
                }} className="w-100 border border-gray-300 rounded px-3 py-1" required />
                
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
                  }}/>
                  
                {type !== 'judgement' && (<button type="button" onClick={() => { if (answer.length > 2) { setAnswer(answer.filter((_, index) => index !== i));}}} className="text-red-500 hover:underline text-sm">
                                  Delete Answer
                </button>)}
              </div>
            ))}

            {type !== 'judgement' && (<button type="button" onClick={() => { if (answer.length < 6) { setAnswer([...answer, { text: '', correct: false }]);}}} className="text-blue-600 hover:underline text-sm">
                          Add Possible Answer
            </button>)}
          </div>

          <div className="flex justify-start gap-4 pt-4">
            <button name='create-question' type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Create</button>
            <button onClick={close} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>
  )
}