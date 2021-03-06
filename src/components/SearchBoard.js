import { Fragment, useEffect, useRef, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { useApi } from '../hooks/useApi'
import { useBoard } from '../hooks/useBoard'
import { FiChevronDown } from 'react-icons/fi'

export const SearchBoard = ({open, openChange}) => {
  const {result: boards, trigger: fetchBoards} = useApi('get', 'boards')
  const inputRef = useRef()
  const [selected, setSelected] = useBoard()
  const [query, setQuery] = useState('')

  const onSelect = (board) => {
    setSelected({
      type: 'SET_BOARD',
      payload: {
        board
      }
    })
  }
  
  useEffect(() => {
    if (open) {
      fetchBoards()
      setQuery('')
    }
 
    const onKeydown = (e) => {
      if (e.key === '/' && !open) {
        openChange(true)
        e.stopPropagation()
        e.preventDefault()
      }
      if (e.key === 'Escape' && open) {
        openChange(false)
      }
    }

    document.addEventListener('keydown', onKeydown)

    return () => {
      document.removeEventListener('keydown', onKeydown)
    }
  }, [open])

  useEffect(() => {
    if (selected) {
      openChange(false)
    }
  }, [selected])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open, inputRef])

  const filteredBoards =
    query === ''
      ? boards ?? []
      : (boards ?? []).filter((board) =>
          board.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  return (<>
    { open && (<div className="w-72 relative">
      <Combobox value={selected} onChange={onSelect} >{({open: comboOpen}) => (<>
        <div className="relative">
          <div className="relative w-full text-left">
            <Combobox.Input
              className="w-full border-none c-input"
              placeholder='Search boards (ESC to close)'
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              ref={inputRef}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <FiChevronDown className="w-5 h-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
          </div>
          <Transition
            show
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options static className="absolute w-full px-1 py-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredBoards.length === 0 && query !== '' ? (
                <div className="cursor-default select-none relative py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredBoards.map((board) => (
                  <Combobox.Option
                    key={board.id}
                    className={({ active }) =>
                      `${active && 'bg-gray-200'} group flex rounded-md items-center w-full px-2 py-2 text-sm`
                    }
                    value={board}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                            }`}
                        >
                          {board.name}
                        </span>
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </>)}</Combobox>
    </div> )}
  </>)
}