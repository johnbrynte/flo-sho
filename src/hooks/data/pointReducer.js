let POINT_ID = Date.now();

export const addPoint = (data, { point: inPoint, index, name }) => {
  const point = inPoint ? { ...inPoint } : {
    id: POINT_ID++,
    name,
    sections: [],
  }

  // TODO: handle duplicates
  let points = [...data.points]
  if (typeof index === 'number') {
    points.splice(index, 0, point.id)
  } else {
    points.push(point.id)
  }

  return {
    ...data,
    pointsById: {
      ...data.pointsById,
      [point.id]: point,
    },
    points,
  }
}

export const deletePoint = (data, { id }) => {
  const pointsById = { ...data.pointsById }
  delete pointsById[id]
  return {
    ...data,
    pointsById,
    points: data.points.filter(pid => pid !== id),
  }
}

export const updatePoint = (data, { id, name }) => {
  const point = data.pointsById[id]
  return {
    ...data,
    pointsById: {
      ...data.pointsById,
      [id]: {
        ...data.pointsById[id],
        name: name ?? point.name,
      },
    },
  }
}

export const movePoint = (data, { source, destination, draggableId }) => {
  const targetIndex = destination.index
  const pointId = parseInt(draggableId.match(/point-([0-9]+)/)[1])

  const point = data.pointsById[pointId]

  return addPoint(deletePoint(data, { id: point.id }), { point, index: targetIndex })
}