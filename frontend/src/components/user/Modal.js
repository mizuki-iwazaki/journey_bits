import React from 'react';
import ReactDOM from 'react-dom';
import CloseIcon from '@mui/icons-material/Close';

const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl m-4 max-w-xl w-full p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
        >
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') // rootではなくmodal-rootなど専用の要素に描画することを推奨
  );
};

export default Modal;
