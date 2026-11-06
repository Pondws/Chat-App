import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoute from './modules/auth/auth.route'
import userRoute from './modules/user/user.route'
import { errorHandler } from '../middleware/error'

const app = express()

// อนุญาตให้ Next.js (คนละ port/โดเมน) เรียก API ได้
// credentials: true จำเป็น เพื่อให้ browser ส่ง/รับ cookie (refresh token)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRoute)
app.use(userRoute)

// ต้องอยู่หลังสุด เพื่อรับ error จากทุก route
app.use(errorHandler)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
