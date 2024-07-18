const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const userRouter = require("./routes/user")

const app = express()
const PORT = 8000

mongoose.connect("mongodb://localhost:27017/blogify").then(e => console.log("MongoDB connected"))

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.use(express.urlencoded({ extended: false }));

app.use("/user", userRouter)
app.get("/", (req, res) => res.render("home"))

app.listen(PORT, () => console.log(`Server Started PORT:8000`))