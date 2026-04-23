import jwt from "jsonwebtoken"

const JWTGenerate = {
  accessToken: (payload: any) => {
    return jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "15m" }
    )
  },
  refreshToken: (payload: any) => {
    return jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    )
  }
}

export default JWTGenerate