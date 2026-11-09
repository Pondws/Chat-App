import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from 'apis'
import { AuthStore } from 'types'

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: async (data) => {
        const {
          email,
          password
        } = data
        await authApi.login({ email, password })
      }
    }),
    {
      name: "auth",
    }
  )
)