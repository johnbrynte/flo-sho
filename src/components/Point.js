import { useState } from "react";
import { createSection, SectionComponent } from "./Section";

let POINT_ID = 0;

export const createPoint = ({ name = "", text = "" }) => {
  return {
    id: POINT_ID++,
    name,
    sections: [createSection({ text })]
  };
};

export const PointComponent = ({ point }) => {
  const [sections, setSections] = useState(point.sections);

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
      <div className="flex flex-col gap-1">
        {sections.map((section) => (
          <SectionComponent section={section} />
        ))}
        <button onClick={addSection}>New section</button>
      </div>
    </div>
  );
};
