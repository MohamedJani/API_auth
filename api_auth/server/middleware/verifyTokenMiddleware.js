const jwt = require('jsonwebtoken');

const verifyToken=(req,res,next)=>{
    const token = req.headers["x-access-token"];

    if(!token){
        return res.status(403).json("Token est requis pour l'authentification ");
    }

    try {
        const decode=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.user = decode;//???????????????
    } catch (error) {
        return res.status(401).json("Token est invalide");
    }

    return next();

}

module.exports=verifyToken;