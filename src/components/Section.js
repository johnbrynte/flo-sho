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
  const turndownService = useRef(null)
  const [text, setText] = useState(section.text)
  const [hasFocused, setHasFocused] = useState(false)

  // const updateDebounce = useDebounce((markdown) => {
  //   onUpdate({
  //     ...section,
  //     text: markdown,
  //   })
  // }, 500)

  // const blurEditor = () => {
  //   quill.current?.root.blur();
  // }

  useEffect(() => {
    turndownService.current = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    })
  }, [])

  useEffect(() => {
    if (text === section.text) {
      return
    }
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
        clink: true,
        keyboard: {
          bindings: {
            tab: {
              key: 9,
              handler: () => true
            }
          }
        }
      }
    }

    // From https://github.com/quilljs/quill/issues/1966#issuecomment-370638285
    Quill.register('modules/clink', (quill) => {
      let currentLink = null;
      quill.container.addEventListener('mouseover', (evt) => {
        if (evt.target.tagName === 'A') {
          currentLink = evt.target;
          currentLink.setAttribute('contenteditable', false);
        } else if (currentLink) {
          currentLink.removeAttribute('contenteditable');
          currentLink = null;
        }
      });
    });

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
 
    // quill stores code blocks as
    //   <pre class="ql-syntax" spellcheck="false">...</pre>
    // but turndown expects
    //   <pre><code>...</code></pre>
    const html = quill.current.root.innerHTML
    .replace(/<pre(?:[^>]*)>([^<>]+)<\/pre>/g, "<pre><code>$1</code></pre>")
    let markdown = turndownService.current.turndown(html)
    
    // check if the HTML parser finds links
    if (delta.ops.some((o) => o.insert === ' ' || o.insert === '\n' || o.insert?.length > 1)) {
      const parsedMarkdown = parseMarkdown(markdown)
      if (markdown !== parsedMarkdown) {
        markdown = parsedMarkdown
        const selection = quill.current.getSelection()
        setFromMarkdown(markdown)
        setTimeout(() => {
          quill.current.setSelection(selection.index)
        })
      }
    }

    // update markdown
    markdownRef.current = markdown
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

  const parseMarkdown = (markdown) => {
    const html = marked.parse(markdown?.replace(/\s\s\n\n/g, "<p><br/></p>\n\n") ?? '')
    return turndownService.current.turndown(html)
  }

  return (
    <div
      className="flex flex-col items-stretch w-full min-h-20"
      ref={textareaRef}
    />
  );
};
