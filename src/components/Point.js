import { SectionComponent } from "./Section";
import { FiTrash2 } from "react-icons/fi";
import { Droppable } from 'react-beautiful-dnd'
import { useData } from "../hooks/data/useData";

export const PointComponent = ({ point, index, lift }) => {
  const { api: { addSection, deletePoint } } = useData()

  return (
    <div>
      <div className="flex justify-between mb-2">
        {point.name}
        <div className="flex justify-end flex-1 opacity-30 hover:opacity-100">
          <button className="flex items-center justify-center w-6 h-6 rounded-sm hover:bg-gray-200"
            onClick={() => deletePoint(point.id)}>
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
                lift={lift} />
            ))}
            {provided.placeholder}
            <button onClick={() => addSection({ pointId: point.id })}>New section</button>
          </div>
        )}
      </Droppable>
    </div>
  );
};
