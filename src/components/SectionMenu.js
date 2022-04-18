import { Menu, Transition } from '@headlessui/react'
import { marked } from 'marked'
import { Fragment, useState } from 'react'
import { FiMenu, FiColumns, FiTrash2 } from 'react-icons/fi'
import { useData } from '../hooks/data/useData'
import { ColorPicker } from './ColorPicker'
import { Modal } from './Modal'

export const SectionMenu = ({ section }) => {
  const { api: { deleteSection, updateSection } } = useData()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
  }

  const items = [
    {
      icon: (<FiTrash2 />),
      text: section.type === 'board' ? "Delete board" : "Delete card",
      action: () => {
        setShowDeleteModal(true)
      },
    },
    ...(section.type === 'board' ? [] : [{
      icon: (<FiColumns />),
      text: "Turn into board",
      action: () => {
        var e = document.createElement('div')
        e.innerHTML = marked.parse(section.text)

        updateSection({
          id: section.id,
          name: e.textContent.split('\n')[0],
          type: 'board',
        }, true)
      },
    }]),
    {
      button: ({ section }) => (
        <ColorPicker section={section} />
      )
    },
  ]

  return (<>
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
    <Modal open={showDeleteModal} title="Delete card?" onClose={closeDeleteModal}>
      <div className="mt-4 flex">
        <button
          className="c-btn-secondary mr-2"
          onClick={closeDeleteModal}
        >
          No
        </button>
        <button className="c-btn-primary"
          onClick={() => {
            closeDeleteModal()
            deleteSection({ id: section.id })
          }}>
          Yes
        </button>
      </div>
    </Modal>
  </>)
}