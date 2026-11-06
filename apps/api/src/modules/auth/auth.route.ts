import { Router } from 'express'
import AuthController from './auth.controller'
import { authorization } from '../../middleware/auth'

const router = Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/refresh', AuthController.refreshToken)
router.post('/logout', AuthController.logout)
router.post('/logout-all', authorization, AuthController.logoutAll)

export default router
