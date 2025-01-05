import React, { useState, useEffect } from 'react';
import '../styles/modal.css';

interface WhiteboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
}

const WhiteboardModal: React.FC<WhiteboardModalProps> = ({
  isOpen,
  onClose,
  message,
  title = 'Message'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div 
        className={`modal-content ${isOpen ? 'active' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="scrollable-content">
            {message.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardModal;