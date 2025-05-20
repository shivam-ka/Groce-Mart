import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import { ErrorPage, Home } from "../pages"

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '',
                element: <Home/>
            }
        ],
        errorElement: <ErrorPage />
    }
])

export default router

