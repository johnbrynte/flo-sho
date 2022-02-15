import { useEffect, useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";
import { createPoint, PointComponent } from "./Point";

export const Timeline = () => {
  const [points, setPoints] = useState(() =>
    [...new Array(10)].map(() =>
      createPoint({
        name: "Test",
        text:
          "Ut pellentesque eros eu lacinia scelerisque. Cras efficitur vel mauris et egestas. Maecenas in lobortis libero, ut suscipit tellus. Sed non mattis ligula."
      })
    )
  );
  const [isDragging, setIsDragging] = useState(false);
  const scrollEl = useRef(null);
  const scroll = useRef(0);
  const scrollOrigin = useRef(0);
  const onScroll = (e) => {
    scroll.current = e.target.scrollLeft;
    if (!isDragging) {
      scrollOrigin.current = e.target.scrollLeft;
    }
  };
  const bind = useDrag(({ down, movement: [mx, my] }) => {
    if (isDragging !== down) {
      setIsDragging(down);
    }
    if (down) {
      if (scrollEl.current) {
        scrollEl.current.scrollLeft = scrollOrigin.current - mx;
      }
    } else {
      scrollOrigin.current = scroll.current;
    }
  });

  useEffect(() => {
    scroll.current = scrollEl.current.scrollLeft;
    scrollOrigin.current = scroll.current;
  }, [scrollEl]);

  const addPoint = () => {
    setPoints([...points, createPoint({
      name: "Test",
    })]);
  };

  return (
    <div className="bg-gray-100 p-1 rounded-md">
      <p>Test</p>
      <div
        className="flex gap-4 px-4 py-10 overflow-x-scroll overscroll-auto touch-none"
        {...bind()}
        ref={scrollEl}
        onScroll={onScroll}
      >
        {points.map((point) => (
          <PointComponent key={point.id} point={point} />
        ))}
      </div>
      <button onClick={addPoint}>New point</button>
    </div>
  );
};
