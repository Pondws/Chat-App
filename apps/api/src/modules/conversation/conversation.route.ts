import Router from "express"
import conversationController from "./conversation.controller"
import authMiddleware from "../../middlewares/auth"

const router = Router()

router.post("/", authMiddleware, conversationController.create)
router.get("/", authMiddleware, conversationController.getList)

export default router