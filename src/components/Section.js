import { useState } from "react";

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
      <textarea
        onChange={(e) => setText(e.target.value)}
        value={text}
        spellcheck={false}
      />
    </div>
  );
};
