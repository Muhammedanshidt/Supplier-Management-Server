import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import admin from "./routes/admin.routes.js"
import supplier from "./routes/suppliers.routes.js"
import tapper  from "./routes/tappers.routes.js"
import driver from "./routes/drivers.routes.js"
const app = express()

// cors
// app.use(cors({
//     origin: process.env.CORS_ORGIN,
//     credentials: true
// }))

app.use(cors())

// common middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// routes
app.use("/api/v1/healtcheck", healthcheckRouter)
app.use("/api/admin", admin)
app.use("/api/supplier", supplier)
app.use("/api/tapper", tapper)
app.use("/api/driver", driver)


export { app }