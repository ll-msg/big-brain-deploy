function Modal({ children, onClose }) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center">
      <div className="relative bg-white p-[20px] rounded-[8px] w-[80%] max-w-[500px]">
        {children}
        <button
          onClick={onClose}
          className="absolute top-[10px] right-[10px] bg-transparent border-none text-[18px] cursor-pointer"
        >
        </button>
      </div>
    </div>
  );
}

export default Modal;