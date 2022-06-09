import { useEffect, useRef, useState, useCallback } from "react";
import { useDrag } from "@use-gesture/react";
import { PointComponent } from "./Point";
import { DragDropContext } from 'react-beautiful-dnd'
import { useData } from "../hooks/data/useData";
import { Droppable } from "react-beautiful-dnd";

export const Timeline = () => {
  const { data, api: { addPoint, movePoint, moveSection } } = useData()

  const onDragEnd = useCallback((result, provided) => {
    switch (result.type) {
      case "point":
        movePoint(result)
        break
      case "section":
        moveSection(result)
        break
      default:
        console.error("Invalid dnd type")
        break
    }
  }, []);

  const sensorAPIRef = useRef(null)
  const [newPointText, setNewPointText] = useState("")
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

  const onNewPointSubmit = (e) => {
    if (e.nativeEvent.which !== 13 || !newPointText) {
      return
    }

    addPoint({
      name: newPointText
    })
    setNewPointText('')
  }

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
    <DragDropContext onDragEnd={onDragEnd}
      sensors={[
        api => {
          sensorAPIRef.current = api;
        },
      ]}>
      <Droppable droppableId={`timeline`} type="point" direction="horizontal">
        {(provided, snapshot) => (
          <div className="flex-1 overflow-auto overscroll-auto touch-none"
            ref={provided.innerRef}>
            <div
              className="flex px-4 h-full pb-10"
              ref={scrollEl}
              onScroll={onScroll}
            >
              {points.map((point, index) => (
                <PointComponent key={point.id}
                  point={point}
                  index={index}
                  lift={lift} />
              ))}
              {provided.placeholder}
              <div className="flex flex-col">
                <div className="w-80 sticky top-0 bg-slate-100">
                  <input className="c-input" type="text"
                    placeholder="Add a stack of cards..."
                    value={newPointText}
                    onChange={(e) => setNewPointText(e.target.value)}
                    onKeyDown={onNewPointSubmit} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
