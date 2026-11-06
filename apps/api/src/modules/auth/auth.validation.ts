import { z } from 'zod'

const authSchema = {
  register: z.object({
    email: z.email('รูปแบบอีเมลไม่ถูกต้อง'),
    password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
    name: z.string('กรุณากรอกชื่อ').trim().min(1, 'กรุณากรอกชื่อ')
  }),
  login: z.object({
    email: z.email('รูปแบบอีเมลไม่ถูกต้อง'),
    password: z.string().min(1, 'กรุณากรอกรหัสผ่าน')
  })
}

export default authSchema
