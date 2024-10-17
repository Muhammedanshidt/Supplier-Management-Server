// index
import { app } from "./app.js"
import connectDB from "./database/index.js"


connectDB()


const port = process.env.PORT || 7777
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
