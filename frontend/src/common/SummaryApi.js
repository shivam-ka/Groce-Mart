export const baseUrl = 'http://localhost:3000' // import.meta.env.BASE_URL 

const summarApi = {
    register: {
        url: '/api/v1/users/register',
        method: 'post'
    },
    login: {
        url: '/api/v1/users/login',
        method: 'post'
    },
    forgotPassword: {
        url: '/api/v1/users/forgot-password',
        method: 'put'
    },
    verifyOtp: {
        url: '/api/v1/users/verify-otp',
        method: 'put'
    },
    resetPassword: {
        url: '/api/v1/users/reset-password',
        method: 'put'
    },
}

export default summarApi