import { useCallback, useEffect, useRef, useState } from "react"
import { SectionComponent } from "./Section";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { Droppable } from 'react-beautiful-dnd'
import { useData } from "../hooks/data/useData";

export const PointComponent = ({ point, index, lift }) => {
  const { api: { addSection, deletePoint, updatePoint, movePoint } } = useData()
  const inputRef = useRef(null)
  const [editName, setEditName] = useState(false)
  const [newPointText, setNewPointText] = useState("")

  useEffect(() => {
    setNewPointText(point.name)
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
    setNewPointText(point.name)
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
    <div>
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
          <button className="c-icon-btn"
            onClick={() => deletePoint({id: point.id})}>
            <FiTrash2 />
          </button>
        </div>
      </div>
      <Droppable droppableId={`${point.id}`}>
        {(provided, snapshot) => (
          <div className="flex flex-col w-80"
            ref={provided.innerRef}
            {...provided.droppableProps}>
            {point.sections.map((section, index) => (
              <SectionComponent key={section.id}
                index={index}
                section={section}
                newSection={newSection}
                movePointLeft={movePointLeft}
                movePointRight={movePointRight}
                lift={lift} />
            ))}
            {provided.placeholder}
            <button className={`c-btn-w-icon ${point.sections.length ? 'mt-2' : ''}`} onClick={newSection}>
              <FiPlus />
              Add card
            </button>
          </div>
        )}
      </Droppable>
    </div>
  );
};
