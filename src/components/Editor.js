import { Timeline } from "./Timeline";
import { DataProvider } from "../hooks/data/useData";
import { useContext, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { InputDialog } from "./InputDialog";
import { UserContext } from "../util/UserContext";

export const Editor = () => {
  const { user } = useContext(UserContext)
  const { result: board, trigger: fetchBoard } = useApi('get')
  const { result: boards, trigger: fetchBoards } = useApi('get', 'boards')
  const { error: createError, trigger: createBoardApi } = useApi('post', 'boards/new')

  useEffect(() => {
    user && fetchBoards()
  }, [user])

  const createBoard = async (data) => {
    await createBoardApi(data)
    fetchBoards()
  }

  return (<>
    <InputDialog button="New board" submitButton="Create" submit={createBoard} error={createError}
      input={[
        {
          key: "name",
          label: "Name",
        }
      ]}
    />
    {!board && boards?.map((b) => (
      <button className="c-btn" key={b.id} onClick={() => fetchBoard({ path: `boards/${b.id}` })}>
        {b.name} ({b.id})
      </button>
    ))}
    {board ? (
      <DataProvider board={board}>
        Board: {board.name}
        <Timeline />
      </DataProvider>
    ) : (
      <DataProvider>
        <Timeline />
      </DataProvider>
    )}
  </>)
}