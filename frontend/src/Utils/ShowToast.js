import CustomToast from "../components/Toast/CustomToast";

const successToast = (response) => {
    CustomToast.success(response.data.message)
}

const errorToast = (err) => {
    CustomToast.error(err.response.data.message)
}

export { successToast, errorToast } 