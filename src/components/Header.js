import { useContext, useState } from "react"
import { useApi } from "../hooks/useApi"
import { useBoard } from "../hooks/useBoard"
import { UserContext } from "../util/UserContext"
import { Popover } from "./Popover"
import { SearchBoard } from "./SearchBoard"
import { InputDialog } from "./InputDialog"
import { FiLogOut, FiPlus, FiSearch } from "react-icons/fi"

export const Header = () => {
  const { loading, user, authError, login: loginTrigger, loginError, logout, register: registerTrigger, registerError } = useContext(UserContext)
  const { error: createError, trigger: createBoardApi } = useApi('post', 'boards/new')
  const [_, dispatchBoard] = useBoard()
  const [searchOpen, setSearchOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const register = (event) => {
    registerTrigger({
      params: {
        name,
        email,
        password,
      },
    })
    event.preventDefault()
  }

  const login = (event) => {
    loginTrigger({
      params: {
        email,
        password,
      },
    })
    event.preventDefault()
  }

  const createBoard = async (data) => {
    const newBoard = await createBoardApi(data)
    if (newBoard) {
      dispatchBoard({
        type: "SET_BOARD",
        payload: {
          board: newBoard
        }
      })
    }
  }

  return (
    <div className="relative flex flex-shrink-0 items-center px-1 mx-1 my-1 h-10 rounded-lg z-20 bg-white shadow-sm">
      {user ? (
        <div className="flex flex-1 justify-between items-center animate-appear">
          <div className="flex items-center">
            <div className="mr-2">
              <InputDialog button={
                <span className="flex items-center">
                  <FiPlus />
                  <span className="ml-2">Create board</span>
                </span>
              } submitButton="Create" submit={createBoard} error={createError}
                input={[
                  {
                    key: "name",
                    label: "Name",
                  }
                ]}
              />
            </div>
            { !searchOpen && (
              <button className="c-btn" onClick={() => setSearchOpen(true)}>
                <span className="flex items-center">
                  <FiSearch />
                  <span className="ml-2">Open board</span>
                </span>
              </button>
            )}
            <SearchBoard open={searchOpen} openChange={setSearchOpen} />
          </div>
          <div className="flex items-center">
            <div className="text-sm">{user.name} <span className="text-gray-400">/ {user.email}</span></div>
            <button className="c-btn ml-2" onClick={logout}>
              <span className="flex items-center">
                <FiLogOut />
                <span className="ml-2">Log out</span>
              </span>
            </button>
          </div>
        </div>
      ) : !loading && (
          <div className="flex justify-end animate-appear">
          {/* TODO: use InputDialog */}
          <div className="relative">
            <Popover button="Register" position="left">
              {() => (
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
              )}
            </Popover>
          </div>

          <span className="mx-2">or</span>

          {/* TODO: use InputDialog */}
          <div className="relative">
            <Popover button="Log in" position="left">
              {() => (
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
              )}
            </Popover>
          </div>

          { authError && (
            <div className="ml-4 text-red-500 text-sm flex items-center">
              { authError.code === 0 && <>Unknown authentication error</> }
            </div>
          )}
        </div>
      )}
    </div>
  )
}