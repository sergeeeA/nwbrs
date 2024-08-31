// components/Modal.js

import React from 'react';
import style from '../styles/Modal.module.css';

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Function to handle clicks on the overlay
  const handleOverlayClick = (event) => {
    // Check if the clicked target is the overlay itself
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={style.modalOverlay} onClick={handleOverlayClick}>
      <div className={style.modalContent}>
        <button onClick={onClose} className={style.closeButton}>Close</button>
        <iframe
          src="https://bipboi.vercel.app"
          title="Bip Boi Website"
          className={style.iframe}
          frameBorder="0"
        />
      </div>
    </div>
  );
};

export default Modal;
