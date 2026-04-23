import express from 'express'
import authRoute from './modules/auth/auth.route'
import userRoute from './modules/user/user.route'

const app = express()

app.use(express.json())

app.use('/auth', authRoute)
app.use(userRoute)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})