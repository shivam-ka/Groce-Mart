import { toast } from 'react-hot-toast';
import { FaCheck, FaExclamationTriangle, FaTimes, FaInfoCircle } from 'react-icons/fa';

const CustomToast = ({ type = 'info', message, onClose }) => {
    // Define styles based on toast type
    const toastStyles = {
        success: {
            border: 'border-green-500',
            icon: <FaCheck className="text-green-500" />,
            bg: 'bg-green-50',
            text: 'text-green-800'
        },
        error: {
            border: 'border-red-500',
            icon: <FaTimes className="text-red-500" />,
            bg: 'bg-red-50',
            text: 'text-red-800'
        },
        warning: {
            border: 'border-yellow-500',
            icon: <FaExclamationTriangle className="text-yellow-500" />,
            bg: 'bg-yellow-50',
            text: 'text-yellow-800'
        },
        info: {
            border: 'border-blue-500',
            icon: <FaInfoCircle className="text-blue-500" />,
            bg: 'bg-blue-50',
            text: 'text-blue-800'
        }
    };

    const style = toastStyles[type] || toastStyles.info;

    return toast.custom((t) => (
        <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
        max-w-md w-full ${style.bg} shadow-lg rounded-lg pointer-events-auto flex 
        ring-1 ${style.border} ring-opacity-50`}
        >
            <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5 text-xl items-center">
                        {style.icon}
                    </div>
                    <div className="ml-3 flex-1">
                        <p className={`text-sm font-medium ${style.text}`}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </p>
                        <p className={`mt-1 text-sm ${style.text}`}>
                            {message || "Here's your notification"}
                        </p>
                    </div>
                </div>
            </div>
            <div onClick={() => {
                toast.dismiss(t.id);
                onClose();
            }} className="flex border-l border-gray-200">
                <button

                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 
            flex items-center justify-center text-sm font-medium text-gray-500 
            hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    <FaTimes />
                </button>
            </div>

        </div>
    ), {
        duration: 3000
    });
};

// Helper functions for different toast types
CustomToast.success = (message, options) =>
    CustomToast({ type: 'success', message, ...options });

CustomToast.error = (message, options) =>
    CustomToast({ type: 'error', message, ...options });

CustomToast.warning = (message, options) =>
    CustomToast({ type: 'warning', message, ...options });

CustomToast.info = (message, options) =>
    CustomToast({ type: 'info', message, ...options });

export default CustomToast;