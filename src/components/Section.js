import { useEffect, useRef, useState } from "react";
import TurndownService from "turndown"
import { marked } from "marked"
import Quill from 'quill'
import QuillMarkdown from 'quilljs-markdown'
import { useData } from "../hooks/data/useData";

export const SectionComponent = ({ section, newSection, movePointLeft, movePointRight, lift }) => {
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

  const blurEditor = () => {
    quill.current?.root.blur();
  }

  useEffect(() => {
    if (text === section.text) {
      return
    }
    console.log("text updated")
    setFromMarkdown(section.text)
  }, [section.text])

  useEffect(() => {
    if (section.focus && !hasFocused) {
      setTimeout(() => {
        quill.current?.root.focus()
      })
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
            movePointLeft: {
              shortKey: true,
              shiftKey: true,
              key: 37,
              handler: () => {
                movePointLeft()
                blurEditor()
                focusSection({ id: section.id })
              }
            },
            movePointRight: {
              shortKey: true,
              shiftKey: true,
              key: 39,
              handler: () => {
                movePointRight()
                blurEditor()
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
    editor.root.addEventListener("keydown", (e) => {
      e.stopPropagation()
    })
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
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    })
    // quill stores code blocks as
    //   <pre class="ql-syntax" spellcheck="false">...</pre>
    // but turndown expects
    //   <pre><code>...</code></pre>
    const html = quill.current.root.innerHTML
      .replace(/<pre(?:[^>]*)>([^<>]+)<\/pre>/g, "<pre><code>$1</code></pre>")
    markdownRef.current = turndownService.turndown(html)

    setText(markdownRef.current)
    updateSection({
      id: section.id,
      text: markdownRef.current,
    })
  }

  const onSelectionChange = (range, oldRange) => {
    if (range === null && oldRange !== null) {
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
    <div
      className="flex flex-col items-stretch w-full min-h-20"
      ref={textareaRef}
    />
  );
};
