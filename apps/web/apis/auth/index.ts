import { axios } from "utils"
import { AuthType } from "types"

export const authApi = {
  login: async (data: AuthType.LoginProps) => {
    const res = await axios.post('/login', data)
    return res.data.data
  }
}