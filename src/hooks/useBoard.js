import { createContext, useContext, useEffect, useReducer, useState } from "react"

const LAST_OPENED_KEY = "flo-sho-last-opened"

export const BoardContext = createContext({
  boards: null,
  dispatchBoard: () => null
})

const boardReducer = (state, action) => {
  switch (action.type) {
    case "SET_BOARD":
      return {
        ...state,
        board: action.payload.board,
      }
  }
  return state
}

export const BoardProvider = ({ children }) => {
  const [{ board }, dispatchBoard] = useReducer(boardReducer, {
    board: null,
  })
  const [lastOpened, setOpenedBoard] = useState(() => {
    try {
      const data = window.localStorage.getItem(LAST_OPENED_KEY)
      return data
    } catch (e) {}
    return null
  });

  useEffect(() => {
    if (board) {
      window.localStorage.setItem(LAST_OPENED_KEY, board.id)
      setOpenedBoard(board.id)
    }
  }, [board])

  useEffect(() => {
    if (lastOpened && lastOpened != board?.id) {
      dispatchBoard({
        type: "SET_BOARD",
        payload: {
          board: {
            id: lastOpened
          }
        }
      })
    }
  }, [lastOpened])

  return (
    <BoardContext.Provider value={[board, dispatchBoard]}>
      {children}
    </BoardContext.Provider>
  )
}

export const useBoard = () => {
  return useContext(BoardContext)
}