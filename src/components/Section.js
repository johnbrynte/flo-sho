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
      className="flex p-2 rounded-md bg-white flex-shrink-0 w-80"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Textarea
        className="w-full resize-none p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(e) => setText(e.target.value)}
        defaultValue={text}
        placeholder="Your text here..."
        rows={3}
      />
    </div>
  );
};
