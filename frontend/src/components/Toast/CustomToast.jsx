import { toast } from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const CustomToast = ({ type = 'info', message, onClose }) => {
    const toastStyles = {
        success: {
            border: 'border-green-400',
            bg: 'bg-green-50',
            text: 'text-green-800',
            accent: 'bg-green-400'
        },
        error: {
            border: 'border-red-400',
            bg: 'bg-red-50',
            text: 'text-red-800',
            accent: 'bg-red-400'
        },
        warning: {
            border: 'border-amber-400',
            bg: 'bg-amber-50',
            text: 'text-amber-800',
            accent: 'bg-amber-400'
        },
        info: {
            border: 'border-purple-400',
            bg: 'bg-purple-50',
            text: 'text-purple-800',
            accent: 'bg-purple-400'
        }
    };

    const style = toastStyles[type] || toastStyles.info;

    return toast.custom((t) => (
        <AnimatePresence>
            {t.visible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className={`max-w-md w-full ${style.bg} ${style.border} shadow-lg rounded-lg pointer-events-auto flex overflow-hidden relative border`}
                >
                    {/* Accent bar */}
                    <div className={`absolute top-0 left-0 h-full w-1 ${style.accent}`} />

                    {/* Progress bar */}
                    <motion.div
                        className={`absolute bottom-0 left-0 h-0.5 ${style.accent}`}
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: 5, ease: 'linear' }}
                    />

                    <div className="flex-1 w-0 p-4 pl-5">
                        <div className="flex-1">
                            <p className={`text-sm font-semibold ${style.text}`}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </p>
                            <p className={`mt-1 text-sm ${style.text}`}>
                                {message || "Here's your notification"}
                            </p>
                        </div>
                    </div>
                    <div className="flex border-l border-gray-200/50">
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                onClose?.();
                            }}
                            className="w-full p-4 flex items-center justify-center text-gray-400 hover:text-gray-500 transition-colors"
                            aria-label="Close"
                        >
                            <FaTimes className="text-lg" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    ), {
        duration: 5000,
        position: 'top-right'
    });
};

// Helper functions with additional options
CustomToast.success = (message, options) =>
    CustomToast({ type: 'success', message, ...options });

CustomToast.error = (message, options) =>
    CustomToast({ type: 'error', message, ...options });

CustomToast.warning = (message, options) =>
    CustomToast({ type: 'warning', message, ...options });

CustomToast.info = (message, options) =>
    CustomToast({ type: 'info', message, ...options });

export default CustomToast;