const { Router } = require("express")
const multer = require("multer")
const path = require("path")
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/assets/upload/`))
    },
    filename: function (req, file, cb) {
        const filName = `${Date.now()}-${file.originalname}`
        cb(null, filName)
    }
})

const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => {
    return res.render("addblog", {
        user: req.user
    })
})

router.get("/:id", async (req, res, next) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy")
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy")
    console.log(blog)
    return res.render("blog", {
        user: req.user,
        blog,
        comments
    })
})

router.post("/comment/:blogId", async (req, res, next) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id
    })
    return res.redirect(`/blog/${req.params.blogId}`);
})

router.post('/', upload.single("coverImageUrl"), async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageUrl: `/assets/upload/${req.file.filename}`
    })
    console.log(req.body)
    console.log(req.file)
    return res.redirect(`/blog/${blog._id}`)
})

module.exports = router;