import { Router } from "express";
import authService from "./auth.service";
import { isValid } from "../../middleware/validation.middleware";
import * as authValidation from "./auth.validation"
const router = Router()

router.post('/register',isValid(authValidation.registerSchema),authService.register)
router.post('/verifyEmail',authService.verifyEmail)
router.post('/resendOtp',authService.resendOtp)
router.post('/login',authService.logIn)

export default router;