//Ce fichier contient les routes pour s'enregistrer, et se connecter apèrs qu'on vérifier le token 
//  et aussi la route qui nous permet de générer les tokens

const route = require('express').Router();
const jwtUtils = require('../utils/jwt.utils'); 
const User = require('../models/UserModel');
const RefreshTokenModel = require('../models/RefreshTokenModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const tokenVerifyMidd=require('../middleware/verifyTokenMiddleware');
let allUsers;

route.get("/hola",(req,res)=>{ 
    res.send({ message: "We did it!" });
});

//registre
route.post('/register',async(req, res)=>{
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    try {
        if(email == null || email == "" || password == null || password == "")
        {
            return res.status(400).json({'erreur': 'paramètres manquants'});
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const user = await new User(
            {
                username : username,
                email : email,
                password : hashPassword,
            }
        );
        const users = await user.save();
        !users && res.status(404).send("Utilisateur n'est pas créé");

        res.status(201).send("Utilisateur a été créer");

    } catch (error) {
        res.status(500).send("n'est pas créé");
    }
});


//Login
route.post("/login", async(req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        if (!user) {
            res.status(404).json("Utilisateur n'est pas trouvé");
            return;
        }

        const compPass = await bcrypt.compare(req.body.password, user.password);
        if (!compPass) {
            res.status(400).json("Mot de passe est Incorrecte");
            return;
        }
        const access_Token = jwtUtils.generateTokenUser(user._id);
        const Refresh_Token = jwtUtils.refreshTokenUser(user._id);
        const find_token_in_schema = await RefreshTokenModel.findOne({user:user._id});
        if(!find_token_in_schema){
            const refreshTokenmodel = new RefreshTokenModel({
                token:Refresh_Token,
                user:user._id,
            });
            await refreshTokenmodel.save();
        }else{
            let new_token = await RefreshTokenModel.findOneAndUpdate({user:user._id},{token:Refresh_Token},{new:true});
        }
        allUsers = await User.find();
        res.status(200).json({user,access_Token,Refresh_Token});
    } catch (err) {
        res.status(500).json(err); 
    }
});
route.get("/home", tokenVerifyMidd, (req,res)=>{ 
    res.status(406).json(allUsers);
});

route.post("/getNewTokenUsingRefresh",async (req,res)=>{
    try{
            const refreshToken = req.body.refresh_Token;
        if(!refreshToken){
            return res.status(401).json("Token requis"); 
        }
        const decode = jwt.verify(refreshToken,process.env.REFRECH_TOKEN_SECRET);
        if(!decode){
            return res.status(403).json("Token est invalide");
        }

        const user_Id = decode.userId;
        
        const find_Token = await RefreshTokenModel.findOne({token:refreshToken});
        if(!find_Token)
        {
            return res.status(403).json("Token a été expirer. Merci de bien se connecter à nouveau");
        }else{
            const access_Token = jwtUtils.generateTokenUser(user_Id);
            const Refresh_Token = jwtUtils.refreshTokenUser(user_Id);
            let new_token = await RefreshTokenModel.findOneAndUpdate({token:refreshToken},{token:Refresh_Token},{new:true});

            return res.status(200).json({access_Token,Refresh_Token});
        }
    } catch (error) {
        res.status(500).json(err);
    }
    

    
});

module.exports = route;