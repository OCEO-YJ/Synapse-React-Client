import * as React from 'react'
import { useState, useEffect } from 'react'
export type CheckboxProps = {
  label: string
  id: string
  checked?: boolean
  className?: string
  onChange: Function
}

export const Checkbox: React.FunctionComponent<CheckboxProps> = (
  props: CheckboxProps,
) => {
  const [checked, setChecked] = useState<boolean>(props.checked || false)

  useEffect(() => {
    setChecked(props.checked || false)
  }, [props.checked])

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    props.onChange(event.target.checked)
  }

  const className = props.className ? `checkbox ${props.className}` : `checkbox`

  return (
    <div className={className}>
      <label>
        <span>
          <input
            type="checkbox"
            checked={checked}
            id={props.id}
            onChange={handleCheckboxChange}
          />
          <span>{props.label}</span>
        </span>
      </label>
    </div>
  )
}
