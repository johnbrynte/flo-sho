import { useEffect, useRef, useState } from "react";
import TurndownService from "turndown"
import { marked } from "marked"
import Quill from 'quill'
import QuillMarkdown from 'quilljs-markdown'
import useDebounce from "../hooks/useDebounce";
import { FiTrash2, FiMoreHorizontal } from "react-icons/fi";
import { Draggable } from 'react-beautiful-dnd'
import { useData } from "../hooks/data/useData";

export const SectionComponent = ({ section, index, lift }) => {
  const { api: { deleteSection, updateSection, focusSection } } = useData()
  const quill = useRef(null)
  const textareaRef = useRef(null)
  const markdownRef = useRef('')
  const [text, setText] = useState(section.text)
  const [hasFocused, setHasFocused] = useState(false)

  // const updateDebounce = useDebounce((markdown) => {
  //   onUpdate({
  //     ...section,
  //     text: markdown,
  //   })
  // }, 500)

  useEffect(() => {
    if (text === section.text) {
      return
    }
    console.log("text updated")
    setFromMarkdown(section.text)
  }, [section.text])

  useEffect(() => {
    if (!quill.current) {
      return
    }
    if (section.focus && !hasFocused) {
      console.log("has focus")
      quill.current.root.focus()
      setHasFocused(false)
    }
  }, [section.focus, hasFocused, quill.current])

  useEffect(() => {
    if (!textareaRef.current) {
      return
    }

    const options = {
      placeholder: 'Some text here...',
      modules: {
        keyboard: {
          bindings: {
            tab: {
              key: 9,
              handler: () => true
            },
            newSection: {
              key: 13,
              shortKey: true,
              handler: function (range, context) {
                newSection()
              }
            },
            moveUp: {
              altKey: true,
              key: 38,
              handler: () => {
                const api = lift(`${section.id}`)
                api?.moveUp()
                api?.drop()
                focusSection({ id: section.id })
              }
            },
            moveDown: {
              altKey: true,
              key: 40,
              handler: () => {
                const api = lift(`${section.id}`)
                api?.moveDown()
                api?.drop()
                focusSection({ id: section.id })
              }
            },
            moveLeft: {
              altKey: true,
              key: 37,
              handler: () => {
                const api = lift(`${section.id}`)
                api?.moveLeft()
                api?.drop()
                focusSection({ id: section.id })
              }
            },
            moveRight: {
              altKey: true,
              key: 39,
              handler: () => {
                const api = lift(`${section.id}`)
                api?.moveRight()
                api?.drop()
                focusSection({ id: section.id })
              }
            },
          }
        }
      }
    }
    const editor = new Quill(textareaRef.current, options)
    editor.on('text-change', onTextChange)
    editor.on('selection-change', onSelectionChange)
    editor.root.setAttribute("spellcheck", "false")
    quill.current = editor

    const markdownOptions = {}
    const quillMarkdown = new QuillMarkdown(editor, markdownOptions)

    setFromMarkdown(section.text)
  }, [textareaRef])

  const onTextChange = (delta, oldDelta, source) => {
    if (!quill.current) {
      return
    }

    // to markdown
    var turndownService = new TurndownService({
      headingStyle: 'atx'
    })
    markdownRef.current = turndownService.turndown(quill.current.root.innerHTML)

    setText(markdownRef.current)
    updateSection({
      id: section.id,
      text: markdownRef.current,
    })
  }

  const onSelectionChange = (range, oldRange) => {
    if (range === null && oldRange !== null) {
      console.log('blur')
      focusSection(null)
    } else if (range !== null && oldRange === null) {
      // focus
    }
  }

  // from markdown
  const setFromMarkdown = (markdown) => {
    if (!quill.current) {
      return
    }

    // empty lines are not treated well "  \n\n"
    const html = marked.parse(markdown?.replace(/\s\s\n\n/g, "<p><br/></p>\n\n") ?? '')
    const delta = quill.current.clipboard.convert(html)
    quill.current.setContents(delta, 'silent')
  }

  return (
    <Draggable draggableId={`${section.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          className="flex flex-col px-2 pt-2 pb-1 rounded-md bg-white flex-shrink-0 mb-4 w-80"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="text-xs text-gray-600">{section.id} (index {index})</div>
          <div
            className="flex flex-col items-stretch w-full min-h-20"
            ref={textareaRef}
          />
          <div className="flex justify-end mt-1 opacity-30 hover:opacity-100">
            <div
              className="flex-1 cursor-grab flex items-center justify-center h-6 rounded-sm hover:bg-gray-100"
              {...provided.dragHandleProps}
            >
              <FiMoreHorizontal />
            </div>
            <div className="">
              <button className="flex items-center justify-center w-6 h-6 rounded-sm hover:bg-gray-100"
                onClick={() => deleteSection({ id: section.id })}>
                <FiTrash2 />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
