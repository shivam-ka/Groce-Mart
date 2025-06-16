import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"


dotenv.config({
    path: './.env'
})

const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN
}))
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(morgan());

app.get('/', (req, res) => {
    res.json(process.env.CORS_ORIGIN)
})

// import router 
import userRouter from "./routes/user.routes.js"
import categoryRouter from "./routes/category.routes.js"
import subCategoryRouter from "./routes/subCategory.routes.js"
import productRouter from "./routes/product.route.js"
import cartRouter from "./routes/cart.routes.js"
import addressRouter from "./routes/address.routes.js"

app.use('/api/v1/users', userRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/subcategory', subCategoryRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/address', addressRouter)

export { app }