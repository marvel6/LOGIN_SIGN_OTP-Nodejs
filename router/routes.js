const express = require('express')
const { route } = require('express/lib/router')
const router = express.Router()

const {register, loginUser, sendOTP, verifyOTP} = require('../controller/user')


router.route('/').post(register)
router.route('/login').post(loginUser)
router.route('/send').post(sendOTP);
router.route('/check').post(verifyOTP)
// router.route('/resend').post(resendOTP)







module.exports = router