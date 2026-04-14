const { models } = require('mongoose');
const captainModel = require('../models/captain.models');
const captainService = require('../services/captain.services');
const { validationResult } = require('express-validator');
const blacklistTokenModels = require('../models/blacklistToken.models');


module.exports.registerCaptain = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const existingCaptain = await captainModel.findOne({ email });
    if(existingCaptain){
        return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        fullname,
        email,
        password: hashedPassword,
        vehicle
    });

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(201).json({ captain, token });
}


module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if(!captain){
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
}


module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json(req.captain);
}


module.exports.logoutCaptain = async (req, res, next) => {
    
    const token = req.cookies?.token || req.headers.authorization?.split(' ').pop();

    await blacklistTokenModels.create({ token })

    res.clearCookie('token');

    res.status(200).json({ message: 'Logged Out' });
}