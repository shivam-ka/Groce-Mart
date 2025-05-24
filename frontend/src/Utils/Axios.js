import axios from "axios"
import summarApi, { baseUrl } from "../common/SummaryApi"

const Axios = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
})

Axios.interceptors.response.use(
    async (config) => {
        const accessToken = localStorage.getItem('accessToken')

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config
    },
    (error) => Promise.reject(error)

)

Axios.interceptors.request.use(
    (response) => {
        return response
    },
    async (error) => {
        let originalRequest = error.config

        if (error.response.statu === 401 && !originalRequest.retry) {
            originalRequest = true

            const refreshToken = localStorage.getItem('refreshToken')

            if (refreshToken) {
                const { newAccessToken, newRefreshToken } = refreshTokenAcessToken()

                if (newAccessToken) {
                    originalRequest.headers.Authorization =  `Bearer ${newRefreshToken}`
                    return Axios(originalRequest)
                }
            }


        }

        return Promise.reject(error)
    }
)

const refreshTokenAcessToken = async (refreshToken) => {
    try {
        const response = await Axios({
            ...summarApi.refreshAccessToken, headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        })

        const { newAccessToken: accessToken, newRefreshToken: refreshToken } = response.data.data;
        localStorage.setItem('accessToken', newAccessToken)
        localStorage.setItem('refreshToken', newRefreshToken)
        return { newAccessToken, newRefreshToken }

    } catch (error) {
        console.log(error)
    }
}

export default Axios