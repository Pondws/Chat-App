import { axios } from "utils"
import { AuthType } from "types"

export const authApi = {
  register: async (data: AuthType.RegisterProps) => {
    const res = await axios.post('/auth/register', data)
    return res.data.data
  },
  login: async (data: AuthType.LoginProps) => {
    const res = await axios.post('/auth/login', data)
    return res.data.data
  },
  getMe: async () => {
    const res = await axios.get('/me')
    return res.data
  },
  logout: async () => {
    const res = await axios.post('/auth/logout')
    return res.data
  }
}

export const meQueryKey = ["auth", "me"] as const