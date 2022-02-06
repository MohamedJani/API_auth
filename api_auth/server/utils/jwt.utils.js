var jwt = require('jsonwebtoken');


module.exports = {
    generateTokenUser: function(userID){
        //const JWT_SIGN_SECRET = process.env.ACCESS_TOKEN_SECRET;
        return jwt.sign({
            userId: userID,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '30s'
        });
    },
    refreshTokenUser: function(userID){
        //const JWT_SIGN_SECRET = process.env.REFRECH_TOKEN_SECRET;
        return jwt.sign({
            userId: userID,
        },
        process.env.REFRECH_TOKEN_SECRET
        );
    }
}