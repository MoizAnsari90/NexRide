const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controllers");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware")


router.post('/register',[
    body('fullname').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long')
], userController.registerUser
);

router.post('/login', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long')
],userController.loginUser)


router.get('/profile' , authMiddleware.authUser, userController.getUserProfile)

router.get('/logout', authMiddleware.authUser, userController.logoutUser)



module.exports = router;  