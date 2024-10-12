import express from "express"
const router = express.Router()

import * as authController from '../controllers/authControllers.js'


router.post('/login', authController.login)
router.post('/reset-password', authController.resetPass)
router.post('/update-password', authController.updatePass)
router.post('/verify-reset-token', authController.verifyResetToken)
router.get('/createresetsession', authController.createResetSession)



export default router