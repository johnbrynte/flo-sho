import { createContext, useContext, useEffect, useState } from "react"
import { addPoint, deletePoint, updatePoint, movePoint } from "./pointReducer"
import { addSection, deleteSection, updateSection, moveSection, focusSection } from "./sectionReducer"
import { useApi } from "../useApi"
import useDebounce from "../useDebounce"

const STORAGE_KEY = "flo-sho-storage"

const api = {
  addPoint,
  deletePoint,
  updatePoint,
  movePoint,
  addSection,
  deleteSection,
  updateSection,
  moveSection,
  focusSection,
}

export const DataContext = createContext({
  data: {},
  api,
})

const getDefaultData = (data) => ({
  pointsById: {},
  sectionsById: {},
  points: [],
  sections: [],
  focusedSection: null,
  ...data,
})

export const DataProvider = ({ board, children }) => {
  const [data, setData] = useState(() => {
    let parsedData = {}
    // TODO: better initialization
    if (board) {
      parsedData = board.data
    } else {
      try {
        const data = window.localStorage.getItem(STORAGE_KEY)
        parsedData = JSON.parse(data)
      } catch (e) { }
    }
    return getDefaultData(parsedData)
  });

  const { error: saveError, trigger: triggerSave } = useApi('post')

  const debouncedSave = useDebounce(() => {
    triggerSave({
      params: {
        data: JSON.stringify(data),
      },
      path: `boards/${board?.id}/update`
    })
  }, 1000, [board, data])

  useEffect(() => {
    if (board) {
      setData(getDefaultData(board.data))
    }
  }, [board])

  useEffect(() => {
    if (board) {
      debouncedSave()
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  }, [board, data])

  const wrappedApi = {}
  for (const key in api) {
    wrappedApi[key] = (args) => setData((d) => api[key](d, args))
  }

  return (
    <DataContext.Provider value={{ data, api: wrappedApi, saveError }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  return useContext(DataContext)
}