import { Timeline } from "./Timeline";
import { DataProvider } from "../hooks/data/useData";
import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { useBoard } from "../hooks/useBoard";
import { Modal } from "./Modal";
import { FiTrash2 } from "react-icons/fi";

export const Editor = () => {
  const [selectedBoard, dispatchBoard] = useBoard()
  const { result: board, loading, trigger: fetchBoard } = useApi('get')
  const { trigger: deleteBoardApi } = useApi('post')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
  }

  const deleteBoard = async () => {
    console.log("delete board", board)
    await deleteBoardApi({ path: `boards/${board.id}/delete` })
    dispatchBoard({
      type: "SET_BOARD",
      payload: {
        board: null
      }
    })
  }

  useEffect(() => {
    selectedBoard && fetchBoard({ path: `boards/${selectedBoard.id}` })
  }, [selectedBoard])

  if (loading) {
    return null
  }

  return (<>
    {selectedBoard && board ? (
      <DataProvider board={board}>
        <div className="flex items-center px-5 py-2 animate-appear">
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
        Open a board with '/' or create a new one.
      </div>
      // <DataProvider>
      //   <Timeline />
      // </DataProvider>
    )}
  </>)
}