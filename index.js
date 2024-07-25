const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const userRouter = require("./routes/user")
const blogRouter = require("./routes/blog")
const cookieParser = require('cookie-parser')
const { checkForAuthenticationCookie } = require("./middleware/authentication")
const Blog = require("./models/blog")

const app = express()
const PORT = 8000

mongoose.connect("mongodb://localhost:27017/blogify").then(e => console.log("MongoDB connected"))

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))

app.use(express.static(path.resolve('./public')))
app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});
    console.log(allBlogs)
    res.render("home", {
        user: req.user,
        blogs: allBlogs
    })
})

app.use("/user", userRouter)
app.use("/blog", blogRouter)

app.listen(PORT, () => console.log(`Server Started PORT:8000`))