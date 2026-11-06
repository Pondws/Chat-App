import express from 'express'
import cors from 'cors'
import { env } from './lib/env'
import authRoute from './modules/auth/auth.route'
import userRoute from './modules/user/user.route'
import { errorHandler } from './middleware/error-handler'

const app = express()

app.use(cors({ origin: env.CORS_ORIGIN }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/auth', authRoute)
app.use(userRoute)

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use(errorHandler)

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`)
})
