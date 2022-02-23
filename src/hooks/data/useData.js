import { createContext, useContext, useEffect, useState } from "react"
import { addPoint, deletePoint, updatePoint } from "./pointReducer"
import { addSection, deleteSection, updateSection, moveSection, focusSection } from "./sectionReducer"

const STORAGE_KEY = "flo-sho-storage"

const api = {
  addPoint,
  deletePoint,
  updatePoint,
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

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    let parsedData = {}
    try {
      const data = window.localStorage.getItem(STORAGE_KEY)
      parsedData = JSON.parse(data)
    } catch (e) { }
    return {
      pointsById: {},
      sectionsById: {},
      points: [],
      sections: [],
      focusedSection: null,
      ...parsedData,
    }
  });

  useEffect(() => {
    // console.log("save")
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const wrappedApi = {}
  for (const key in api) {
    wrappedApi[key] = (args) => setData((d) => api[key](d, args))
  }

  return (
    <DataContext.Provider value={{ data, api: wrappedApi }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  return useContext(DataContext)
}