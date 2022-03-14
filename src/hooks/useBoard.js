import { createContext, useContext, useReducer } from "react"

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

  return (
    <BoardContext.Provider value={[board, dispatchBoard]}>
      {children}
    </BoardContext.Provider>
  )
}

export const useBoard = () => {
  return useContext(BoardContext)
}