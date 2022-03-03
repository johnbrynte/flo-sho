import { useCallback, useEffect, useRef, useState } from "react"
import { SectionComponent } from "./Section";
import { FiMoreHorizontal, FiTrash2, FiPlus } from "react-icons/fi";
import { Droppable } from 'react-beautiful-dnd'
import { useData } from "../hooks/data/useData";
import { Draggable } from "react-beautiful-dnd";

export const PointComponent = ({ point, index, lift }) => {
  const { api: { addSection, deletePoint, updatePoint, movePoint } } = useData()
  const inputRef = useRef(null)
  const [editName, setEditName] = useState(false)
  const [newPointText, setNewPointText] = useState("")

  useEffect(() => {
    setNewPointText(point.name || '')
  }, [point.name])

  const newSection = () => {
    addSection({ pointId: point.id, focus: true })
  }

  const movePointLeft = useCallback(() => {
    movePoint({
      id: point.id,
      index: index - 1,
    })
  }, [point, index])

  const movePointRight = useCallback(() => {
    movePoint({
      id: point.id,
      index: index + 1,
    })
  }, [point, index])

  const cancelEditName = () => {
    setNewPointText(point.name || '')
    setEditName(false)
    inputRef.current?.blur()
  }

  const onNewPointSubmit = (e) => {
    if (e.nativeEvent.key === 'Escape') {
      cancelEditName()
      return
    }
    if (e.nativeEvent.key !== 'Enter' || !newPointText) {
      return
    }

    updatePoint({
      id: point.id,
      name: newPointText,
    })
    setEditName(false)
    inputRef.current?.blur()
  }

  return (
    <Draggable draggableId={`point-${point.id}`} index={index} type="point">
      {(provided, snapshot) => (
        <div className="bg-gray-200 rounded-md p-1 mr-2"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="flex items-center justify-between mb-2">
            <input type="text"
              ref={inputRef}
              className={editName ? 'c-input' : 'bg-transparent'}
              placeholder="New point"
              value={newPointText}
              onChange={(e) => setNewPointText(e.target.value)}
              onKeyDown={onNewPointSubmit}
              onFocus={() => setEditName(true)}
              onBlur={cancelEditName} />
            <div className="flex justify-end flex-1 opacity-30 hover:opacity-100">
              <div
                className="flex items-center justify-center w-6 h-6 rounded-sm hover:bg-gray-200 cursor-grab"
                {...provided.dragHandleProps}
              >
                <FiMoreHorizontal />
              </div>
              <button className="flex items-center justify-center w-6 h-6 rounded-sm hover:bg-gray-200"
                onClick={() => deletePoint(point.id)}>
                <FiTrash2 />
              </button>
            </div>
          </div>
          <Droppable droppableId={`point-${point.id}`} type="section">
            {(provided, snapshot) => (
              <div className="flex flex-col w-80"
                ref={provided.innerRef}>
                {point.sections.map((section, index) => (
                  <SectionComponent key={section.id}
                    index={index}
                    section={section}
                    lift={lift} />
                ))}
                {provided.placeholder}
                <button onClick={() => addSection({ pointId: point.id })}>New section</button>
              </div>
            )}
          </Droppable>
          {provided.placeholder}
        </div>
      )}
    </Draggable>
  );
};
