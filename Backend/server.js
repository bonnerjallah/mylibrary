require("dotenv").config()
const express = require("express")
const cors = require("cors")
const path = require("path")

const connectDB = require("./config/db")
const router = require("./routes/router")
const cookieParser = require("cookie-parser")


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

const corsOptions = {
    origin: [process.env.ADMIN_FRONTEND_URL, process.env.CLIENT_FRONTEND_URL],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}
app.use(cors(corsOptions))

app.use("/booksimages", express.static(path.join(__dirname, "../shared-assets/public/booksimages")))
app.use("/libraryusersprofilepics", express.static(path.join(__dirname, "../shared-assets/public/libraryusersprofilepics")))
app.use("/postpictures", express.static(path.join(__dirname, "../shared-assets/public/postpictures")))



app.use("/", router)

connectDB()

app.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`)
})