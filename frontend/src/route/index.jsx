import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import { ErrorPage, ForgotPassword, Home, Login, Register, UserDashboard, Address } from "../pages"


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
            },
            {
                path: 'dashboard',
                children: [
                    {
                        path: '',
                        element: <UserDashboard />
                    },
                    {
                        path: 'address',
                        element: <Address />
                    }
                ]
            }
        ],
        errorElement: <ErrorPage />
    }
])

export default router

