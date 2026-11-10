import Router from "express"
import conversationController from "./conversation.controller"

const router = Router()

router.post("/", conversationController.create)

export default router