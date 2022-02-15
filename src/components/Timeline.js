import { useEffect, useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";
import { createPoint, PointComponent } from "./Point";

export const Timeline = () => {
  const [points, setPoints] = useState(() =>
    [...new Array(10)].map(() =>
      createPoint({
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
    setPoints([...points, createPoint()]);
  };

  return (
    <div className="bg-gray p-1 radius-1">
      <p>Test</p>
      <div
        className="flex gap-1 py-4 overflow-x-scroll"
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
