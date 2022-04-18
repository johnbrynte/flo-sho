import { Timeline } from "./Timeline";
import { DataProvider } from "../hooks/data/useData";
import { useContext, useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { useBoard } from "../hooks/useBoard";
import { Modal } from "./Modal";
import { FiChevronRight, FiTrash2 } from "react-icons/fi";
import { UserContext } from "../util/UserContext";

export const Editor = () => {
  const { loggedIn } = useContext(UserContext)
  const [selectedBoard, dispatchBoard] = useBoard()
  const { result: board, loading, trigger: fetchBoard } = useApi('get')
  const { result: deleteBoardResult, trigger: deleteBoardApi } = useApi('post')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
  }

  const deleteBoard = async () => {
    await deleteBoardApi({ path: `boards/${board.id}/delete` })
    dispatchBoard({
      type: "SET_BOARD",
      payload: {
        board: null
      }
    })
  }

  const openBoard = (board) => {
    dispatchBoard({
      type: "SET_BOARD",
      payload: {
        board
      }
    })
  }

  useEffect(() => {
    if (!loggedIn && board) {
      dispatchBoard({
        type: "SET_BOARD",
        payload: {
          board: null
        }
      })
    }
  }, [loggedIn, board])

  useEffect(() => {
    if (deleteBoardResult?.data?.removed?.parent) {
      openBoard({
        id: deleteBoardResult.data.removed.parent.id
      })
    }
  }, [deleteBoardResult])

  useEffect(() => {
    selectedBoard && fetchBoard({ path: `boards/${selectedBoard.id}` })
  }, [selectedBoard])

  useEffect(() => {
    if (board) {
      document.title = board.name
    }
  }, [board])

  if (loading) {
    return null
  }

  return (<>
    {selectedBoard && board ? (
      <DataProvider board={board}>
        <div className="flex items-center px-5 py-2 animate-appear">
          { board.parent && (<>
            <button className="text-lg text-slate-500 hover:text-black hover:underline" onClick={() => openBoard(board.parent)}>
              {board.parent.name}
            </button>
            <FiChevronRight className="mx-2" />
          </>)}
          <div className="mr-2 text-lg font-semibold">
            {board.name}
          </div>
          <button className="c-icon-btn opacity-40 hover:opacity-100" onClick={() => setShowDeleteModal(true)}>
            <FiTrash2 />
          </button>
        </div>
        <Timeline />
        <Modal open={showDeleteModal} title="Delete board?" onClose={closeDeleteModal}>
          <div className="mt-4 flex">
            <button
              className="c-btn-secondary mr-2"
              onClick={closeDeleteModal}
            >
              No
            </button>
            <button className="c-btn-primary"
              onClick={() => {
                closeDeleteModal()
                deleteBoard()
              }}>
              Yes
            </button>
          </div>
        </Modal>
      </DataProvider>
    ) : (
      <div className="px-5 py-4">
        <div className="h-20">
          { loggedIn && (
            <>Open a board with '/' or create a new one.</>
          )}
        </div>
        <div className="flex">
          <div className="w-80 px-1 flex flex-col">
            <div className="w-full h-24 mb-2 bg-slate-200 rounded-md">
            </div>
            <div className="w-full h-40 mb-2 bg-slate-200 rounded-md">
            </div>
          </div>
          <div className="w-80 px-1 flex flex-col">
            <div className="w-full h-36 mb-2 bg-slate-200 rounded-md">
            </div>
          </div>
        </div>
      </div>
      // <DataProvider>
      //   <Timeline />
      // </DataProvider>
    )}
  </>)
}