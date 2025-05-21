export const baseUrl = 'http://localhost:3000'

const summarApi = {
    register: {
        url: '/api/v1/users/register',
        method: 'post'
    },
    login: {
        url: '/api/v1/users/login',
        method: 'post'
    },
}

export default summarApi