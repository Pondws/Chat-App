export namespace AuthType {
  export interface LoginProps {
    email: string
    password: string
  }
}

export interface AuthStore {
  user: null
  login: (data) => Promise<void>
}