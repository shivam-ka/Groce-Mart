import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import { ErrorPage, ForgotPassword, Home, Login, Register } from "../pages"

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '',
                element: <Home />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: 'forgot-password',
                element: <ForgotPassword />
            }
        ],
        errorElement: <ErrorPage />
    }
])

export default router

