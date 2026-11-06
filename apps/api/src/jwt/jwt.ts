import jwt from "jsonwebtoken"

export type JwtPayload = {
  id: number
  email: string
}

// อ่านค่าตอนเรียกใช้ (ไม่ใช่ตอน import) กันปัญหา .env ยังไม่ถูกโหลด
const ACCESS_SECRET = () => process.env.JWT_ACCESS_SECRET as string
const REFRESH_SECRET = () => process.env.JWT_REFRESH_SECRET as string

// อายุ refresh token (ใช้ทั้งตอน sign JWT, บันทึกลง DB และตั้งอายุ cookie)
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 วัน

const JWTGenerate = {
  accessToken: (payload: JwtPayload) => {
    return jwt.sign(payload, ACCESS_SECRET(), { expiresIn: "15m" })
  },
  refreshToken: (payload: JwtPayload) => {
    return jwt.sign(payload, REFRESH_SECRET(), {
      expiresIn: REFRESH_TOKEN_TTL_MS / 1000,
      // ใส่ค่าสุ่มเพื่อให้ token ไม่ซ้ำ แม้จะออกในวินาทีเดียวกัน
      jwtid: crypto.randomUUID(),
    })
  },
  verifyAccessToken: (token: string) => {
    return jwt.verify(token, ACCESS_SECRET()) as JwtPayload
  },
  verifyRefreshToken: (token: string) => {
    return jwt.verify(token, REFRESH_SECRET()) as JwtPayload
  },
}

export default JWTGenerate
