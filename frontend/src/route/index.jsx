import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import { ErrorPage, ForgotPassword, Home, Login, Register, UserDashboard, Address, Category, SubCategory, UploadProduct, ProductListPage, ProductDisplayPage, SearchPage, CheckOutPage, Order } from "../pages"
import AdminProtractor from "../layout/AdminProtractor"


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
                path: 'search',
                element: <SearchPage />
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
                path: '/checkout',
                element: <CheckOutPage />
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
                        element: <AdminProtractor> <Category /> </AdminProtractor>
                    },
                    {
                        path: 'sub-category',
                        element: <AdminProtractor> <SubCategory /> </AdminProtractor>
                    },
                    {
                        path: 'upload-product',
                        element: <AdminProtractor> <UploadProduct /> </AdminProtractor>
                    },
                    {
                        path: 'orders',
                        element: <Order />
                    }

                ]
            },
            {
                path: ':category',
                children: [
                    {
                        path: ":subCategory",
                        element: <ProductListPage />
                    }
                ]
            },
            {
                path: "product/:product",
                element: <ProductDisplayPage />
            }
        ],
        errorElement: <ErrorPage />
    }
])

export default router

