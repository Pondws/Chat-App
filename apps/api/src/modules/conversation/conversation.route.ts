import Router from "express"
import conversationController from "./conversation.controller"
import authMiddleware from "../../middlewares/auth"

const router = Router()

router.post("/", authMiddleware, conversationController.create)

export default router