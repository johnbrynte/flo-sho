import { createContext, useEffect, useState } from "react"
import { useApi } from "../hooks/useApi"

const TOKEN_STORAGE_KEY = "flo-sho-token"

export const UserContext = createContext({
  token: null,
  user: null,
  loggedIn: false,
  login: () => { },
  loginError: null,
  logout: () => { },
  register: () => { },
})

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return window.localStorage.getItem(TOKEN_STORAGE_KEY)
    } catch (e) { }
    return null
  })

  const { trigger: logoutTrigger } = useApi("post", "user/logout", token)
  const { result: loginData, error: loginError, trigger: login } = useApi("post", "user/login", token)
  const { result: registerData, error: registerError, trigger: register } = useApi("post", "user/register", token)
  const { error: authError, loading, result: user, trigger: auth } = useApi("post", "user/auth", token)

  const loggedIn = !!user

  const logout = async () => {
    await logoutTrigger()
    setToken(null)
  }

  useEffect(() => {
    loginData && setToken(loginData?.token)
  }, [loginData])

  useEffect(() => {
    registerData && setToken(registerData?.token)
  }, [registerData])

  useEffect(() => {
    try {
      if (!token) {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY)
      } else {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
      }
    } catch (e) { }
    auth()
  }, [token])

  return (<>
    <UserContext.Provider value={{ token, loggedIn, loading, authError, user, login, loginError, register, registerError, logout }}>
      {children}
    </UserContext.Provider>
  </>)
}