export const baseUrl = 'http://localhost:3000' // import.meta.env.BASE_URL 

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
    }
}

export default summarApi