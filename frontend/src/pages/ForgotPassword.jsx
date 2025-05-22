import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoEye, IoEyeOff, IoArrowBack } from 'react-icons/io5';
import Axios from '../Utils/Axios';
import summarApi from '../common/SummaryApi';
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const ForgotPasswordPage = () => {
    const [state, setState] = useState('requestOTP');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const primaryColor = '#6945c5';
    const primaryHoverColor = '#5d3cbb';

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {

            const response = await Axios({
                ...summarApi.forgotPassword, data: email
            })
            console.log(email)
            console.log(response)
            if (response.data.success) {
                setState('verifyOTP');
                toast.success(response.data.message)
            }

        } catch (error) {
            console.log(error)
            setError(error.response.data.message)
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await Axios({
                ...summarApi.verifyOtp, data: { email, otp }
            })

            console.log(response)
            if (response.data.success) {
                setState('resetPassword');
                toast.success(response.data.message)
            }

        } catch (error) {
            console.log(error)
            setError(error.response.data.message)
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const response = await Axios({
                ...summarApi.resetPassword, data: { email, newPassword }
            })
            console.log(response)
            if (response.data.success) {
                setState('resetPassword');
                toast.success(response.data.message)
                navigate('/login')
            }
        } catch (error) {
            console.log(error)
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 flex pt-20 pb-36 flex-col justify-center items-center" style={{ backgroundColor: primaryColor }}>
            <div className="w-full max-w-md px-4">

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mb-4 bg-white bg-opacity-90 border-l-4 border-red-500 p-4 rounded"
                        >
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <motion.div
                        key={state}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-[#2e3644] bg-opacity-90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden px-6 py-10"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-8"
                        >
                            <h2 className={`text-3xl font-bold text-yellow-500`}>
                                {state === 'requestOTP' && 'Forgot Password'}
                                {state === 'verifyOTP' && 'Verify OTP'}
                                {state === 'resetPassword' && 'Reset Password'}
                            </h2>
                            <p className='mt-2 text-sm text-gray-300'>
                                {state === 'requestOTP' && 'Enter your email to receive a verification code'}
                                {state === 'verifyOTP' && 'Enter the OTP sent to your email'}
                                {state === 'resetPassword' && 'Create a new password for your account'}
                            </p>
                        </motion.div>

                        {state === 'requestOTP' && (
                            <form onSubmit={handleRequestOTP} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                        Email address
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${isLoading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'}`}
                                        style={{ backgroundColor: isLoading ? primaryHoverColor : primaryColor }}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending OTP...
                                            </>
                                        ) : 'Send OTP'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {state === 'verifyOTP' && (
                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                <div>
                                    <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-1">
                                        Verification Code
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            id="otp"
                                            name="otp"
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            required
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent tracking-widest"
                                            placeholder="Enter 6-digit code"
                                        />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                        We've sent a code to {email}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setState('requestOTP')}
                                        className="text-sm font-medium text-purple-600 hover:text-purple-500 flex items-center"
                                    >
                                        <IoArrowBack className="mr-1" />
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        className="text-sm font-medium text-purple-600 hover:text-purple-500"
                                    >
                                        Resend Code
                                    </button>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${isLoading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'}`}
                                        style={{ backgroundColor: isLoading ? primaryHoverColor : primaryColor }}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Verifying...
                                            </>
                                        ) : 'Verify Code'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {state === 'resetPassword' && (
                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                                        New Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? (
                                                <IoEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                            ) : (
                                                <IoEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                                        Confirm Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <IoEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                            ) : (
                                                <IoEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${isLoading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'}`}
                                        style={{ backgroundColor: isLoading ? primaryHoverColor : primaryColor }}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Resetting...
                                            </>
                                        ) : 'Reset Password'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

    );
};

export default ForgotPasswordPage;