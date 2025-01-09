const jwt = require("jsonwebtoken");
const {JWT_USER_PASSWORD} = require("../config");

function userMiddleware(req, res, next){
    const token = req.headers.token;

    try{
        const decoded = jwt.verify(token,JWT_USER_PASSWORD);

        req.userId = decoded.id;

        next();
    }catch(e){
        return res.status(403).json({
            message: "You are not signed in!",
        });
    }
}


module.exports = {
    userMiddleware: userMiddleware
}