export const baseUrl = import.meta.env.VITE_BASE_URL

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
    refreshAccessToken: {
        url: '/api/v1/users/refresh-access-token',
        method: 'post'
    },
    getCurrentUser: {
        url: '/api/v1/users/get-current-user',
        method: 'get'
    },
    logOut: {
        url: '/api/v1/users/logout',
        method: 'get'
    },
    updateProfile: {
        url: '/api/v1/users/update-profile',
        method: 'put'
    },
    category: {
        getAllCategory: {
            url: '/api/v1/category/get-all-category',
            method: 'get'
        },
        addCategory: {
            url: '/api/v1/category/add-category',
            method: 'post'
        },
        updateCategory: {
            url: '/api/v1/category/update-category',
            method: 'put'
        },
        deleteCategory: {
            url: '/api/v1/category/remove-category',
            method: 'delete'
        }
    },
    subCategory: {
        addSubCategory: {
            url: '/api/v1/subcategory/add-subcategory',
            method: 'post'
        },
        getAllSubCategory: {
            url: '/api/v1/subcategory/get-allsubcategory',
            method: 'post'
        },
        updateSubCategory: {
            url: '/api/v1/subcategory/update-subcategory',
            method: 'put'
        },
        removeSubCategory: {
            url: '/api/v1/subcategory/remove-subcategory',
            method: 'delete'
        }
    },
    product: {
        addProduct: {
            url: '/api/v1/product/add-product',
            method: 'post'
        },
        getPorduct: {
            url: '/api/v1/product/get-product',
            method: 'post'
        },
        updateProduct: {
            url: '/api/v1/product/update-product',
            method: 'put'
        },
        getPorductByCategory: {
            url: 'api/v1/product/get-product-by-category',
            method: 'get'
        },
        getPorductByCatAndSubCat: {
            url: 'api/v1/product/get-product-by-cat-and-subcat',
            method: 'post'
        },
        getProductDetails: {
            url: 'api/v1/product/get-product-details',
            method: 'get'
        },
        deleteProduct: {
            url: 'api/v1/product/delete-product',
            method: 'delete'
        },
        searchProduct: {
            url: 'api/v1/product/search-product',
            method: 'get'
        }
    },
    cart: {
        addToCart: {
            url: 'api/v1/cart/add-to-cart',
            method: 'post'
        },
        getCartItem: {
            url: 'api/v1/cart/get-cart',
            method: 'get'
        },
        updateQty: {
            url: 'api/v1/cart/update-qty',
            method: 'put'
        },
        removeCartItem: {
            url: 'api/v1/cart/remove-cart-product',
            method: 'delete'
        }
    },
    address: {
        addAddress: {
            url: 'api/v1/address/add-address',
            method: 'post'
        },
        getAddress: {
            url: 'api/v1/address/get-address',
            method: 'get'
        },
        updateAddress: {
            url: 'api/v1/address/update-address',
            method: 'put'
        },
        deleteAddress: {
            url: 'api/v1/address/delete',
            method: 'delete'
        }

    }
}

export default summarApi