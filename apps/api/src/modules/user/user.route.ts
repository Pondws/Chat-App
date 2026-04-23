import { Router } from "express";
import userController from "./user.controller";
import { authorization } from "../../../middleware/auth";

const router = Router()

router.get('/me', authorization, userController.getMe)

export default router