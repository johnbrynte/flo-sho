import { useEffect, useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";
import { createPoint, PointComponent } from "./Point";
import useMounted from "../hooks/useMounted";

const STORAGE_KEY = "flo-sho-storage"

export const Timeline = () => {
  const [points, setPoints] = useState(() => {
    try {
      const data = window.localStorage.getItem(STORAGE_KEY)
      const parsedData = JSON.parse(data)
      if (parsedData.points) {
        return parsedData.points
      }
    } catch (e) { }
    return [...new Array(10)].map(() =>
      createPoint({
        name: "Test",
        text:
          "Ut pellentesque eros eu lacinia scelerisque. Cras efficitur vel mauris et egestas. Maecenas in lobortis libero, ut suscipit tellus. Sed non mattis ligula."
      })
    )
  });
  const mounted = useMounted()

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

  useEffect(() => {
    mounted && save({ points })
  }, [points.length])

  const save = (data) => {
    console.log("save")
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  const addPoint = () => {
    setPoints([...points, createPoint({
      name: "Test",
    })]);
  };

  const deletePoint = (point) => {
    setPoints(points.filter((p) => p.id !== point.id));
  }

  const pointUpdate = (point) => {
    const newPoints = points.map((p) => {
      if (point.id === p.id) {
        return point
      } else {
        return p
      }
    })
    save({
      points: newPoints
    })
  }

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
          <PointComponent key={point.id}
            point={point}
            onUpdate={pointUpdate}
            onDelete={deletePoint} />
        ))}
      </div>
      <button onClick={addPoint}>New point</button>
    </div>
  );
};
