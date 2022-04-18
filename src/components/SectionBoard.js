import { FiColumns } from "react-icons/fi"
import { useBoard } from "../hooks/useBoard"

export const SectionBoard = ({section}) => {
  const [_, dispatchBoard] = useBoard()

  const openBoard = () => {
    dispatchBoard({
      type: 'SET_BOARD',
      payload: {
        board: {
          id: section.board_id
        }
      }
    })
  }

  return (
    <button className="flex items-center card__btn text-left px-2 py-2 hover:opacity-70 rounded-t-md" onClick={openBoard}>
      <FiColumns className="mr-2" />
      <span className="font-semibold">{section.text}</span>
    </button>
  )
}