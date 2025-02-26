const Jwt = require("jsonwebtoken")
//secert key
const secret = "SAB7500"; 

//create Token
function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImage: user.profileImageUrl,
        role: user.role
    };
    const token = Jwt.sign(payload, secret)
    return token;
}
function validateToken(token) { 
    const payload = Jwt.verify(token, secret)
    return payload
}
module.exports = { 
    createTokenForUser,
    validateToken

}