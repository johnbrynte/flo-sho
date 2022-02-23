import { useEffect, useRef, useState, useCallback } from "react";
import { useDrag } from "@use-gesture/react";
import { PointComponent } from "./Point";
import { DragDropContext } from 'react-beautiful-dnd'
import { useData } from "../hooks/data/useData";

export const Timeline = () => {
  const { data, api: { addPoint, moveSection } } = useData()

  const onDragEnd = useCallback((result, provided) => {
    moveSection(result)
  }, []);

  const sensorAPIRef = useRef(null)
  const scrollEl = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const scroll = useRef(0);
  const scrollOrigin = useRef(0);
  const onScroll = (e) => {
    scroll.current = e.target.scrollLeft;
    if (!isDragging) {
      scrollOrigin.current = e.target.scrollLeft;
    }
  };

  // Drag
  // const bind = useDrag(({ down, movement: [mx, my] }) => {
  //   if (isDragging !== down) {
  //     setIsDragging(down);
  //   }
  //   if (down) {
  //     if (scrollEl.current) {
  //       scrollEl.current.scrollLeft = scrollOrigin.current - mx;
  //     }
  //   } else {
  //     scrollOrigin.current = scroll.current;
  //   }
  // });

  function lift(sectionId) {
    if (isDragging) {
      return null;
    }

    const api = sensorAPIRef.current;

    if (!api) {
      console.warn('unable to find sensor api');
      return null;
    }

    const preDrag = api.tryGetLock(sectionId, () => { });

    if (!preDrag) {
      console.log('unable to start capturing');
      return null;
    }

    return preDrag.snapLift();
  }

  useEffect(() => {
    scroll.current = scrollEl.current.scrollLeft;
    scrollOrigin.current = scroll.current;
  }, [scrollEl]);

  const points = data.points.map((id) => (
    {
      ...data.pointsById[id],
      sections: data.pointsById[id].sections.map((id) => ({
        ...data.sectionsById[id],
        focus: data.focusedSection === id,
      })),
    }
  ))

  return (
    <div className="bg-gray-100 p-1 rounded-md">
      <DragDropContext onDragEnd={onDragEnd}
        sensors={[
          api => {
            sensorAPIRef.current = api;
          },
        ]}>
        <div
          className="flex gap-4 px-4 py-10 overflow-x-scroll overscroll-auto touch-none"
          ref={scrollEl}
          onScroll={onScroll}
        >
          {points.map((point, index) => (
            <PointComponent key={point.id}
              point={point}
              index={index}
              lift={lift} />
          ))}
        </div>
      </DragDropContext>
      <button onClick={addPoint}>New point</button>
    </div>
  );
};
