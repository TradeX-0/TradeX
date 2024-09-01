import jwt from "jsonwebtoken"
import "dotenv/config"

const getUser = (token) => {
    if(!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET)
}



module.exports = {
    getUser,
}