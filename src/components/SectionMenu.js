import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { FiMenu, FiTrash2 } from 'react-icons/fi'
import { useData } from '../hooks/data/useData'
import { ColorPicker } from './ColorPicker'

export const SectionMenu = ({ section }) => {
  const { api: { deleteSection } } = useData()

  const items = [
    {
      icon: (<FiTrash2 />),
      text: "Delete card",
      action: () => {
        deleteSection({ id: section.id })
      },
    },
    {
      button: ({ section }) => (
        <ColorPicker section={section} />
      )
    },
  ]

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="c-card-btn flex items-center justify-center w-6 h-6 rounded-sm">
          <FiMenu />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 bottom-full w-56 mt-2 origin-bottom-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {items.map(({ text, icon, action, button }, index) => (
            <Fragment key={index}>
              {button ? button({ section }) : (
                <div className="px-1 py-1 relative">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active && 'bg-gray-200'} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        onClick={action}
                      >
                        {icon && <div className="flex justify-center w-4 mr-2">{icon}</div>}
                        {text}
                      </button>
                    )
                    }
                  </Menu.Item>
                </div>
              )}
            </Fragment>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}