const userModel = require("../models/user.models");
const userService = require("../services/user.services");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const blacklistTokenSchema = require("../models/blacklistToken.models")

module.exports.registerUser = async (req, res , next) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userModel.create({
        fullname,
        email,
        password: hashedPassword
    });

    const token = user.generateAuthToken();


    res.cookie('token', token)

    res.status(201).json({ user, token });

}


module.exports.loginUser = async (req, res , next) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }

    const {email, password} = req.body;

    const user = await userModel.findOne({email}).select('+password');

    if(!user){
        return res.status(401).json({ message : 'invalid email or password'})
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({messaga : 'Invalid email or password'})
    }

    const token = user.generateAuthToken()

    res.status(200).json({ token , user});

}

module.exports.getUserProfile = async (req , res, next ) => {
    res.status(200).json(req.user);
}


module.exports.logoutUser = async (req, res , next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ').pop();

    
    res.status(200).json({message : "Logged Out"})
}
