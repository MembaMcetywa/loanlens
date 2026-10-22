import * as React from 'react'
import { cn } from 'cn'

import { Input } from './input'
import { Label } from './label'

type InputFieldProps = React.ComponentProps<typeof Input> & {
  label: string
  error?: string
  placeholder?: string
}

const InputField = ({
  id,
  label,
  error,
  placeholder,
  disabled,
  required,
  'aria-describedby': ariaDescribedBy,
  ...props
}: InputFieldProps) => {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  const describedBy = [ariaDescribedBy, error ? errorId : undefined]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="grid gap-2" data-disabled={disabled || undefined}>
      <Label
        htmlFor={inputId}
        className={cn(disabled && 'text-muted-foreground')}
      >
        {label}
      </Label>
      <Input
        id={inputId}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export { InputField }
export type { InputFieldProps }
