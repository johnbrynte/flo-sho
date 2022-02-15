import { useState } from "react";
import Textarea from "react-expanding-textarea"

let SECTION_ID = 0;

export const createSection = ({ text = "" }) => {
  return {
    id: SECTION_ID++,
    text
  };
};

export const SectionComponent = ({ section }) => {
  const [text, setText] = useState(section.text);

  return (
    <div
      className="flex align-stretch p-1 radius-1 bg-white shrink-0 w-point h-point"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Textarea
        onChange={(e) => setText(e.target.value)}
        defaultValue={text}
      />
    </div>
  );
};
