const { Schema, model } = require("mongoose")
const { createHmac, randomBytes } = require('node:crypto');
const { createTokenForUser } = require("../service/authentication");

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    profileImageUrl: {
        type: String,
        default: "/assets/images/avatar.png"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, { timestamps: true });



userSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password")) return

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest("hex")

    this.salt = salt;
    this.password = hashedPassword

    next()
});

userSchema.static("matchPasswordGenrateToken", async function (email, password) {
    const user = await this.findOne({ email })
    if (!user) throw new Error("User Not Found")

    const salt = user.salt;
    const hashedPassword = user.password

    const userProviderHashed = createHmac('sha256', salt).update(password).digest("hex")
    if (hashedPassword !== userProviderHashed) throw new Error("Incorrect Password")

    const token = createTokenForUser(user)
    return token;

})

const User = model("user", userSchema);
module.exports = User