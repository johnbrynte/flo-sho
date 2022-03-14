import { Popover as HeadlessPopover, Transition } from "@headlessui/react"
import { Fragment } from "react"

export const Popover = ({ button, position, children }) => {
  return (
    <HeadlessPopover className="relative">
      {({ open, close }) => (
        <>
          <HeadlessPopover.Button
            className="c-btn"
          >
            {button}
          </HeadlessPopover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <HeadlessPopover.Panel className={`absolute z-10 w-screen max-w-sm px-4 top-0 sm:px-0 lg:max-w-3xl ${position === 'right' ? 'right-0' : 'left-0'}`}>
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                {children({close})}
              </div>
            </HeadlessPopover.Panel>
          </Transition>
        </>
      )}
    </HeadlessPopover>
  )
}