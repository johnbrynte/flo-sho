import { useState } from "react";
import { Popover } from "./Popover"

let UNIQUE = 1;

export const InputDialog = ({ input, error, position, button, submitButton, submit }) => {
  const [data, setData] = useState({})
  const [id] = useState(UNIQUE += 1)

  return (
    <div className="relative">
      <Popover position={position} button={button}>
        {({close}) => (
        <form className="p-4 bg-white" onSubmit={(e) => {
          submit({
            params: data,
          })
          const clearedData = {}
          input.forEach(({key}) => {
            clearedData[key] = ''
          })
          setData(clearedData)
          close()
          e.preventDefault()
        }}>
          {input.map((inp, i) => (
            <div key={i}>
              <label htmlFor={`${id}-${inp.key}`}>{inp.label}</label>
              <input className="c-input"
                id={`${id}-${inp.key}`}
                type={inp.type ?? "text"}
                value={data[inp.key]}
                onChange={(e) => setData({
                  ...data,
                  [inp.key]: e.target.value,
                })} />
            </div>
          ))}
          {error && <p className="text-red-800">{error}</p>}
          <button type="submit" className="c-btn c-btn-primary">{submitButton}</button>
        </form>
        )}
      </Popover>
    </div>
  )
}