import React, { useEffect, useState } from 'react';
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

    // TODO: Add thumbnail & video url back
    const handleSubmit = () => {
        const newGame = ({
            gameId: uniqueId,
            name,
            
            questions: [],
            active: false,
            createdAt: new Date().toISOString(),
        });
        create(newGame);
    }

    // TODO: Add thumbnail & video url back
    return (
        <div className="modal-container">
            <div className="modal-header">
                <h4 className="modal-title">Create a new game</h4>
            </div>
            <div className="modal-body">
                <input type="text" value={name} placeholder='Enter game name' onChange={(e) => setName(e.target.value)} />

            </div>
            <div className="modal-button">
                <button onClick={handleSubmit}>Create</button>
                <button onClick={close}>Cancel</button>
            </div>
        </div>
    );
}

export default CreateGameModal;