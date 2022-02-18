import { useEffect, useRef } from "react";
import TurndownService from "turndown"
import { marked } from "marked"
import Quill from 'quill'
import QuillMarkdown from 'quilljs-markdown'
import useDebounce from "../hooks/useDebounce";
import { FiTrash2 } from "react-icons/fi";

let SECTION_ID = Date.now();

export const createSection = ({ text = "" }) => {
  return {
    id: SECTION_ID++,
    text
  };
};

export const SectionComponent = ({ section, newSection, onUpdate, onDelete }) => {
  const quill = useRef(null)
  const textareaRef = useRef(null)
  const updateDebounce = useDebounce((markdown) => {
    onUpdate({
      ...section,
      text: markdown,
    })
  }, 500)

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
            }
          }
        }
      }
    }
    const editor = new Quill(textareaRef.current, options)
    editor.on('text-change', onTextChange)
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
    var markdown = turndownService.turndown(quill.current.root.innerHTML)

    updateDebounce(markdown)
  }

  // from markdown
  const setFromMarkdown = (markdown) => {
    if (!quill.current) {
      return
    }

    // empty lines are not treated well "  \n\n"
    const html = marked.parse(markdown.replace(/\s\s\n\n/g, "<p><br/></p>\n\n"))
    const delta = quill.current.clipboard.convert(html)
    quill.current.setContents(delta, 'silent')
  }

  return (
    <div
      className="flex flex-col px-2 pt-2 pb-1 rounded-md bg-white flex-shrink-0 w-80"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className="flex flex-col items-stretch w-full min-h-20"
        ref={textareaRef}
      />
      <div className="flex justify-end mt-1 opacity-30 hover:opacity-100">
        <div className="">
          <button className="flex items-center justify-center w-6 h-6 rounded-sm hover:bg-gray-200"
            onClick={() => onDelete(section)}>
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};
