import Router from "express"
import messageController from "./message.controller"
import authMiddleware from "../../middlewares/auth"

const router = Router()

router.get("/:id/messages", authMiddleware, messageController.get)
router.post("/:id/messages", authMiddleware, messageController.send)
router.post("/:id/read", authMiddleware, messageController.markRead)

export default router