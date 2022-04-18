import { FiMoreHorizontal } from "react-icons/fi";
import { Draggable } from 'react-beautiful-dnd'
import { SectionComponent } from "./Section"
import { SectionBoard } from "./SectionBoard"
import { SectionMenu } from "./SectionMenu";
import { colors } from "./ColorPicker";

export const SectionWrapper = ({section, index, lift }) => {
  const sectionColor = colors.find((c) => c.name === section.color)

  const boardClass = section.type === 'board' ? 'card--board' : ''

  return (
    <Draggable draggableId={`section-${section.id}`} index={index} type="section">
      {(provided, snapshot) => (
        <div
          className={`flex flex-col pb-1 rounded-md flex-shrink-0 mb-2 w-80 card-${sectionColor?.name ?? 'white'} ${boardClass}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          { section.type === 'board' ? (
            <SectionBoard section={section} />
          ) : (
            <SectionComponent section={section} lift={lift} />
          )}
          <div className="flex justify-end px-2 pt-2">
            <div
              className="c-card-btn flex-1 cursor-grab flex items-center justify-center h-6 rounded-sm"
              {...provided.dragHandleProps}
            >
              <FiMoreHorizontal />
            </div>
            <div>
              <SectionMenu section={section} />
            </div>
          </div>
          {provided.placeholder}
        </div>
      )}
    </Draggable>
  )
}