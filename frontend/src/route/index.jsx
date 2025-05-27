import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import { ErrorPage, ForgotPassword, Home, Login, Register, UserDashboard, Address, Category, SubCategory, UploadProduct, Product } from "../pages"


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
                    },
                    {
                        path: 'category',
                        element: <Category />
                    },
                    {
                        path: 'sub-category',
                        element: <SubCategory />
                    },
                    {
                        path: 'upload-product',
                        element: <UploadProduct />
                    },
                    {
                        path: 'product',
                        element: <Product />
                    },
                ]
            }
        ],
        errorElement: <ErrorPage />
    }
])

export default router

