import { Router } from "express"
import authMiddleware from "../../middlewares/auth"
import UserController from "./user.controller"

const router = Router()

router.get("/me", authMiddleware, UserController.getMe)
router.get("/users", authMiddleware, UserController.searh)

export default router