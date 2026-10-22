import * as React from 'react'
import { cn } from 'cn'

import { Label } from './label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'

type SelectFieldOption = {
  value: string
  label: string
  disabled?: boolean
}

type SelectFieldProps = Omit<
  React.ComponentProps<typeof Select>,
  'children'
> & {
  id?: string
  label: string
  options: readonly SelectFieldOption[]
  placeholder?: string
  error?: string
}

const SelectField = ({
  id,
  label,
  options,
  placeholder,
  error,
  disabled,
  required,
  ...props
}: SelectFieldProps) => {
  const generatedId = React.useId()
  const selectId = id ?? generatedId
  const errorId = `${selectId}-error`

  return (
    <div className="grid gap-2" data-disabled={disabled || undefined}>
      <Label
        htmlFor={selectId}
        className={cn(disabled && 'text-muted-foreground')}
      >
        {label}
      </Label>
      <Select disabled={disabled} required={required} {...props}>
        <SelectTrigger
          id={selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export { SelectField }
export type { SelectFieldOption, SelectFieldProps }
