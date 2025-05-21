import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../Utils/Axios";
import summarApi from "../common/SummaryApi";
import toast from "react-hot-toast"

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const navigate = useNavigate()

    const messages = [
        "By continuing, you agree to our Terms of Service",
        "Your privacy is important to us",
        "Secure SSL encrypted connection",
        "We never share your personal data",
        "Two-factor authentication available",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [messages.length]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Minimum 8 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            try {
                console.log(formData)
                const response = await Axios({ ...summarApi.login, data: formData })

                navigate('/')
            } catch (error) {
                console.log(error)
                toast(error.response.data.message,
                    {
                        icon: '👏', style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                            top: 15,
                            right: 15
                        },
                    }
                );
            }
            setIsSubmitting(false)
        }
    };

    return (
        <div className=" bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4 py-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <motion.div

                    className="bg-[#2e3644] backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20"
                >
                    <div className="p-8">

                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-center mb-4"
                        >
                            <motion.h1
                                animate={{
                                    color: ["#eb7d07", "#facc15", "#eb5e07"],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                                className="text-3xl font-bold mb-1"
                            >
                                Welcome Back
                            </motion.h1>
                            <p className="text-gray-300">Sign in to continue</p>
                        </motion.div>


                        <div className="relative h-8 mb-6 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={currentMessageIndex}
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -30, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center text-sm text-gray-400 absolute inset-0"
                                >
                                    {messages[currentMessageIndex]}
                                </motion.p>
                            </AnimatePresence>
                        </div>


                        <form onSubmit={handleSubmit}>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mb-5"
                            >
                                <div className="flex items-center mb-1">
                                    <label className="text-gray-300 text-sm font-medium">Email</label>
                                    {formData.email.includes('@') && formData.email.includes('.com') && !errors.email && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="ml-2 text-xs text-green-400"
                                        >
                                            ✓ Valid
                                        </motion.span>
                                    )}
                                </div>
                                <motion.div
                                    whileFocus={{ scale: 1.01 }}
                                    className="relative"
                                >
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className={`w-full px-4 py-3 rounded-lg bg-white/5 border backdrop-blur-sm focus:outline-none focus:ring-2 text-white ${errors.email
                                            ? "border-red-500 focus:ring-red-400/50"
                                            : "border-gray-600 focus:ring-yellow-400/50 focus:border-yellow-400"
                                            }`}
                                        placeholder="your@email.com"
                                    />
                                </motion.div>
                                {errors.email && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-400 text-xs mt-1"
                                    >
                                        {errors.email}
                                    </motion.p>
                                )}
                            </motion.div>


                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mb-6"
                            >
                                <div className="flex items-center mb-1">
                                    <label className="text-gray-300 text-sm font-medium">Password</label>
                                    {formData.password.length >= 8 && !errors.password && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="ml-2 text-xs text-green-400"
                                        >
                                            ✓ Secure
                                        </motion.span>
                                    )}
                                </div>
                                <motion.div
                                    whileFocus={{ scale: 1.01 }}
                                    className="relative"
                                >
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className={`w-full px-4 py-3 rounded-lg bg-white/5 border backdrop-blur-sm focus:outline-none focus:ring-2 text-white ${errors.password
                                            ? "border-red-500 focus:ring-red-400/50"
                                            : "border-gray-600 focus:ring-yellow-400/50 focus:border-yellow-400"
                                            }`}
                                        placeholder="••••••••"
                                    />
                                </motion.div>
                                {errors.password && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-400 text-xs mt-1"
                                    >
                                        {errors.password}
                                    </motion.p>
                                )}
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isSubmitting}
                                className='cursor-pointer w-full py-3 px-4 bg-[#6945c5] text-white rounded-lg font-bold shadow-lg transition-all relative overflow-hidden'
                            >
                                {isSubmitting && (
                                    <motion.span
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "100%" }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.5,
                                            ease: "linear",
                                        }}
                                        className="absolute top-0 left-0 h-full w-1/2 bg-yellow-400/30 skew-x-[-20deg]"
                                    />
                                )}
                                <span className="relative z-10 flex items-center justify-center">
                                    {isSubmitting ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </span>
                            </motion.button>
                        </form>


                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-6 "
                        >
                            <p className="text-gray-400 text-sm">
                                Don't have an account?{" "}

                                <Link to={'/register'} className="text-yellow-500 font-medium hover:underline">
                                    Click here
                                </Link>
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="mt-1 "
                        >
                            <p className="text-gray-400 text-sm">
                                Forgot Password?{" "}

                                <Link to={'/forgot-password'} className="text-green-500 font-medium hover:underline">
                                    Click here
                                </Link>
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;