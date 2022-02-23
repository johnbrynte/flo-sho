let POINT_ID = Date.now();

export const addPoint = (data, { name }) => {
  const point = {
    id: POINT_ID++,
    name,
    sections: [],
  }
  return {
    ...data,
    pointsById: {
      ...data.pointsById,
      [point.id]: point,
    },
    points: [...data.points, point.id],
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
  setData({
    ...data,
    pointsById: {
      ...data.pointsById,
      [id]: {
        ...data.pointsById[id],
        name: name ?? point.name,
      },
    },
  })
}