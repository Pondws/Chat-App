import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoute from './modules/auth/auth.route'
import userRoute from './modules/user/user.route'
import ConversationRoute from './modules/conversation/conversation.route'
import MessageRoute from './modules/message/message.route'

const app = express()

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRoute)
app.use(userRoute)
app.use('/conversations', ConversationRoute)
app.use('/conversations', MessageRoute)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})