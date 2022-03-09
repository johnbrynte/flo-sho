import { useContext, useState } from "react"
import { UserContext } from "../util/UserContext"
import { Popover } from "./Popover"

export const Header = () => {
  const { user, login: loginTrigger, loginError, logout, register: registerTrigger, registerError } = useContext(UserContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const register = (event) => {
    registerTrigger({
      name,
      email,
      password,
    })
    event.preventDefault()
  }

  const login = (event) => {
    loginTrigger({
      email,
      password,
    })
    event.preventDefault()
  }

  if (!user) {
    return (<>
      <div className="flex">
        <div className="relative">
          <Popover button="Register">
            <form className="p-4 bg-white" onSubmit={register}>
              <label htmlFor="login-name">Name</label>
              <input className="c-input" id="login-name" type="text" name="name"
                value={name} onChange={(e) => setName(e.target.value)} />
              <label htmlFor="login-email">Email</label>
              <input className="c-input" id="login-email" type="email" name="email"
                value={email} onChange={(e) => setEmail(e.target.value)} />
              <label htmlFor="login-password">Password</label>
              <input className="c-input mb-4" id="login-password" type="password" name="password"
                value={password} onChange={(e) => setPassword(e.target.value)} />
              {registerError && <p className="text-red-800">{registerError}</p>}
              <button type="submit" className="c-btn c-btn-primary">Register</button>
            </form>
          </Popover>
        </div>

        <span className="mx-2">or</span>

        <div className="relative">
          <Popover button="Log in">
            <form className="p-4 bg-white" onSubmit={login}>
              <label htmlFor="login-email">Email</label>
              <input className="c-input" id="login-email" type="email" name="email"
                value={email} onChange={(e) => setEmail(e.target.value)} />
              <label htmlFor="login-password">Password</label>
              <input className="c-input mb-4" id="login-password" type="password" name="password"
                value={password} onChange={(e) => setPassword(e.target.value)} />
              {loginError && <p className="text-red-800">{loginError}</p>}
              <button type="submit" className="c-btn c-btn-primary">Log in</button>
            </form>
          </Popover>
        </div>
      </div>
    </>)
  }

  return (<>
    <span>Logged in as {user.name} ({user.email}) <button className="c-btn" onClick={logout}>Log out</button></span>
  </>)
}