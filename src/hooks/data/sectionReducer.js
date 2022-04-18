let SECTION_ID = Date.now();

export const addSection = (data, { pointId, section: inSection, index, text, focus = false }) => {
  const section = inSection ? { ...inSection } : {
    id: SECTION_ID++,
    text: text ?? '',
  }

  // TODO: handle duplicates
  let pointSections = [...data.pointsById[pointId].sections]
  if (typeof index === 'number') {
    pointSections.splice(index, 0, section.id)
  } else {
    pointSections.push(section.id)
  }

  return {
    ...data,
    pointsById: {
      ...data.pointsById,
      [pointId]: {
        ...data.pointsById[pointId],
        sections: pointSections,
      },
    },
    sectionsById: {
      ...data.sectionsById,
      [section.id]: section,
    },
    sections: [...data.sections, section.id],
    focusedSection: focus ? section.id : data.focusedSection,
  }
}

export const deleteSection = (data, { id }) => {
  const sectionsById = { ...data.sectionsById }
  delete sectionsById[id]

  const pointsById = {}
  for (const key in data.pointsById) {
    const point = data.pointsById[key]
    pointsById[key] = {
      ...point,
      sections: point.sections.filter(sid => sid !== id),
    }
  }

  return {
    ...data,
    pointsById,
    sectionsById,
    sections: data.sections.filter(sid => sid !== id),
  }
}

export const updateSection = (data, { id, board_id, name, text, color, type }) => {
  const section = data.sectionsById[id]
  return {
    ...data,
    sectionsById: {
      ...data.sectionsById,
      [id]: {
        ...section,
        board_id: board_id ?? section.board_id,
        name: name ?? section.name,
        text: text ?? section.text,
        color: color ?? section.color,
        type: type ?? section.type,
      },
    },
  }
}

export const moveSection = (data, { source, destination, draggableId }) => {
  if (!destination) {
    return data
  }
  const targetId = parseInt(destination.droppableId.match(/point-([0-9]+)/)[1])
  const targetIndex = destination.index
  const sectionId = parseInt(draggableId.match(/section-([0-9]+)/)[1])

  const section = data.sectionsById[sectionId]

  return addSection(deleteSection(data, { id: section.id }), { pointId: targetId, section, index: targetIndex })
}

export const focusSection = (data, args) => {
  return {
    ...data,
    focusedSection: args?.id ?? null,
  }
}