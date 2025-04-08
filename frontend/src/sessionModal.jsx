import React, { useEffect, useState } from 'react';
import './sessionModal.css'

function Modal({ children, onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-body">
                {children}
                <button className="modal-button" onClick={onClose}>X</button>
            </div>
        </div>
    );
}

export default Modal;