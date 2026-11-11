import Router from "express"
import conversationController from "./conversation.controller"
import authMiddleware from "../../middlewares/auth"

const router = Router()

router.get("/", authMiddleware, conversationController.getList)
router.get("/direct/:userId", authMiddleware, conversationController.getDirect)
router.post("/direct/:userId/message", authMiddleware, conversationController.sendDirect)

router.post("/", authMiddleware, conversationController.create)

export default router