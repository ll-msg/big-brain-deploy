import { useState } from 'react';
import { fileToDataUrl } from './helper';

function CreateGameModal({ close, create }) {
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const uniqueId = Math.floor(Date.now() + Math.random() * 1000);

  const handleThumbNail = async(e) => {
    const img = e.target.files[0];
    if(!img) return;
    const encodedImg = await fileToDataUrl(img);
    setThumbnail(encodedImg);
  }

  const handleSubmit = () => {
    const newGame = ({
      id: uniqueId,
      name,
      thumbnail,
      questions: [],
      active: false,
      createdAt: new Date().toISOString(),
    });
    create(newGame);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 pointer-events-none flex items-center justify-center z-50">
      <div className="bg-white text-black pointer-events-auto rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xl font-semibold">Create a new game</h4>
          <button onClick={close} className="text-gray-500 hover:text-black text-lg">&times;</button>
        </div>
        <div className="space-y-4">
          <input type="text" value={name} placeholder='Enter game name' onChange={(e) => setName(e.target.value)} />
          <input type="file" accept="image/*" onChange={handleThumbNail} />
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button name="create-game" onClick={handleSubmit} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Create</button>
          <button onClick={close} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default CreateGameModal;
