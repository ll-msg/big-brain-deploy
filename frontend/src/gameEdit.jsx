import { useState } from 'react';
import { fileToDataUrl } from './helper';

function EditGameModal({ close, update, game }) {
  const [name, setName] = useState(game.name || '');
  const [thumbnail, setThumbnail] = useState(game.thumbnail || '');

  const handleThumbNail = async (e) => {
    const img = e.target.files[0];
    if (!img) return;
    const encodedImg = await fileToDataUrl(img);
    setThumbnail(encodedImg);
  };

  const handleSubmit = () => {
    const updatedGame = {
      ...game, 
      name,
      thumbnail,
    };
    update(updatedGame);
    close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 pointer-events-none flex items-center justify-center z-50">
      <div className="bg-white text-black pointer-events-auto rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xl font-semibold">Edit Game</h4>
          <button onClick={close} className="text-gray-500 hover:text-black text-lg">&times;</button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            value={name}
            placeholder="Enter game name"
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbNail}
            className="w-full"
          />
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Save
          </button>
          <button onClick={close} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditGameModal;
