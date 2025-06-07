import { motion } from "framer-motion";
import { useEffect } from "react";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Footer, Navbar } from "../components";

const InvalidURLPage = ({ navigateTo = "/" }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(navigateTo)
        }, 5000);
        return () => clearTimeout(timer);
    }, [navigateTo]);

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-[90vh] bg-white flex flex-col items-center justify-center p-6"
            >
                <motion.div
                    initial={{ y: -20, scale: 0.95 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="max-w-md w-full text-center rounded-xl p-8 "
                >
                    {/* Error Icon (Pulse Animation) */}
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mb-4"
                    >
                        <FaExclamationTriangle className="h-8 w-8 text-purple-600" />
                    </motion.div>

                    {/* 404 Not Found Heading */}
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-bold text-purple-800 mb-2"
                    >
                        404 Not Found
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-purple-600 mb-6"
                    >
                        The page you're looking for doesn't exist or has been moved.
                    </motion.p>

                    {/* Countdown Progress Bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mb-6"
                    >
                        <p className="text-sm text-purple-500 mb-1">
                            Redirecting in <span className="font-mono font-bold">5</span> seconds...
                        </p>
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 5, ease: "linear" }}
                            className="bg-purple-600 h-1.5 rounded-full"
                        />
                    </motion.div>

                    {/* Home Button (Bounce Animation) */}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(navigateTo)}
                        className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                    >
                        <FaHome className="mr-2" />
                        Go to Home
                    </motion.button>
                </motion.div>
            </motion.div>
        </>

    );
};

export default InvalidURLPage;