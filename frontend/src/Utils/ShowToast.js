import CustomToast from "../components/Toast/CustomToast";

const successToast = (response) => {
    CustomToast.success(response.data.message)
}

const errorToast = (err) => {
    CustomToast.error(err.response.data.message)
}

const warningToast = (msg) => {
    CustomToast.warning(msg)
}


const infoToast = (msg) => {
    CustomToast.info(msg)
}

export { successToast, errorToast, warningToast, infoToast } 