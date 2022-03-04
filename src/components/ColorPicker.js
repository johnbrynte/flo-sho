import { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useData } from '../hooks/data/useData'

export const colors = [
  { name: 'white' },
  { name: 'red' },
  { name: 'blue' },
  { name: 'yellow' },
  { name: 'green' },
  { name: 'purple' },
]

export const ColorPicker = ({ section }) => {
  const [selectedColor, setSelectedColor] = useState(colors.find((c) => c.name === (section?.color || 'white')))
  const [hover, setHover] = useState(false)
  const { api: { updateSection } } = useData()

  const onMouseOver = (e) => {
    setHover(true)
    e.stopPropagation()
  }

  useEffect(() => {
    const bodyHover = (e) => {
      setHover(false)
    }

    document.body.addEventListener("mouseover", bodyHover)

    return () => {
      document.body.removeEventListener("mouseover", bodyHover)
    }
  }, [])

  useEffect(() => {
    if (selectedColor?.name !== section?.color) {
      updateSection({
        id: section.id,
        color: selectedColor?.name,
      })
    }
  }, [selectedColor])

  return (
    <>
      <div className="px-1 py-1 relative"
        onMouseOver={onMouseOver}>
        <Menu.Item>
          {({ active }) => (
            <div
              className={`${active && 'bg-gray-200'} group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
              {selectedColor ? (
                <>
                  <div className={`mr-2 w-4 h-4 rounded-sm border border-gray-500 card-${selectedColor.name}`} />
                  Color: {selectedColor.name}
                </>
              ) : (
                <>Set color</>
              )}
              <Transition
                show={hover}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 -translate-x-6"
                enterTo="transform opacity-100 translate-x-0"
                leave="transition ease-in duration-100"
                leaveFrom="transform opacity-100 translate-x-0"
                leaveTo="transform opacity-0 -translate-x-6"
              >
                <div className="absolute z-10 left-full top-0 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  onMouseOver={onMouseOver}>
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      className={`cursor-pointer select-none flex w-full items-center py-2 pl-4 pr-4 hover:bg-gray-200`}
                      onClick={() => {
                        setHover(false)
                        setSelectedColor(color)
                      }}
                    >
                      <div className={`mr-2 w-4 h-4 rounded-sm border border-gray-500 card-${color.name}`} />
                      {color.name}
                    </button>
                  ))}
                </div>
              </Transition>
            </div>
          )}
        </Menu.Item>
      </div>
    </>
  )
}
