import express from "express"
import brandsRouter from "./api/v1/brandsRouter.js"
import clientRouter from "./clientRouter.js"

const rootRouter = new express.Router()

rootRouter.use("/api/v1/brands", brandsRouter)
rootRouter.use("/", clientRouter)

export default rootRouter
