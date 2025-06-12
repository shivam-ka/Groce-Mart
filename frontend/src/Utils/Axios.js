import axios from "axios";
import summarApi, { baseUrl } from "../common/SummaryApi";

const Axios = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

// Request interceptor to add the access token to headers
Axios.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
Axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                // No refresh token available, reject
                return Promise.reject(error);
            }

            try {
                // Attempt to refresh tokens
                const { newAccessToken, newRefreshToken } = await refreshTokenAcessToken(refreshToken);

                if (newAccessToken && newRefreshToken) {
                    // Update local storage with new tokens
                    localStorage.setItem('accessToken', newAccessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    // Update the Authorization header
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    // Retry the original request with new token
                    return Axios(originalRequest);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Optional: Clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                // window.location.href = '/login'; // Uncomment if you want to redirect
            }
        }

        return Promise.reject(error);
    }
);

const refreshTokenAcessToken = async (refreshToken) => {
    try {
        const response = await axios({
            ...summarApi.refreshAccessToken,
            baseURL: baseUrl,
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        });

        return response.data.data; // { newAccessToken, newRefreshToken }
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};

export default Axios;