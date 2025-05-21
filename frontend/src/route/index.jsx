import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import { ErrorPage, Home, Login, Register } from "../pages"

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
                element: <Register/>
            }
        ],
        errorElement: <ErrorPage />
    }
])

export default router

