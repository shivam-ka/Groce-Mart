import multer from "multer"

const storage = multer.diskStorage({
    filename: function (_, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

export default upload