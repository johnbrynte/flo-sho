import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import useMounted from "../hooks/useMounted";
import { createSection, SectionComponent } from "./Section";

let POINT_ID = 0;

export const createPoint = ({ name = "", text = "" }) => {
  return {
    id: POINT_ID++,
    name,
    sections: [createSection({ text })]
  };
};

export const PointComponent = ({ point, onUpdate }) => {
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

  return (
    <div>
      <div>{point.name}</div>
      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <SectionComponent key={section.id} section={section} newSection={addSection} onUpdate={sectionUpdate} />
        ))}
        <button onClick={addSection}>New section</button>
      </div>
    </div>
  );
};
