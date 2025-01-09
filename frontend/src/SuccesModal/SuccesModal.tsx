
interface SuccessModalProps {
  
  onClose: () => void;
}

const SuccessModal = ({ onClose }: SuccessModalProps) => {
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 text-green-500">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2"/>
              <path 
                d="M6 12l4 4 8-8" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Order Successfully Received
          </h2>
          
          <p className="mb-6 text-gray-600">
            Thank you for your order. A confirmation has been sent to your email.
          </p>

          <button
            onClick={onClose}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;