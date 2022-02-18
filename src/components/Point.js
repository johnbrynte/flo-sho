import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import useMounted from "../hooks/useMounted";
import { createSection, SectionComponent } from "./Section";
import { FiTrash2 } from "react-icons/fi";

let POINT_ID = Date.now();

export const createPoint = ({ name = "", text = "" }) => {
  return {
    id: POINT_ID++,
    name,
    sections: [createSection({ text })]
  };
};

export const PointComponent = ({ point, onUpdate, onDelete }) => {
  const [sections, setSections] = useState(point.sections);
  const mounted = useMounted()

  useEffect(() => {
    mounted && onUpdate({
      ...point,
      sections,
    })
  }, [sections.length])

  const sectionUpdate = (section) => {
    const newSections = sections.map((s) => {
      if (section.id === s.id) {
        return section
      } else {
        return s
      }
    })
    onUpdate({
      ...point,
      sections: newSections,
    })
  }

  const addSection = () => {
    setSections([
      ...sections,
      createSection({
        text: "",
      })
    ]);
  };

  const deleteSection = (section) => {
    setSections(sections.filter((s) => s.id !== section.id));
  }

  return (
    <div>
      <div className="flex justify-between mb-2">
        {point.name}
        <div className="flex justify-end flex-1 opacity-30 hover:opacity-100">
          <button className="flex items-center justify-center w-6 h-6 rounded-sm hover:bg-gray-200"
            onClick={() => onDelete(point)}>
            <FiTrash2 />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-80">
        {sections.map((section) => (
          <SectionComponent key={section.id}
            section={section}
            newSection={addSection}
            onUpdate={sectionUpdate}
            onDelete={deleteSection} />
        ))}
        <button onClick={addSection}>New section</button>
      </div>
    </div>
  );
};
