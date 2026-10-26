import * as React from 'react'
import { cn } from 'cn'

import { Input } from './input'
import { Label } from './label'
import { Tooltip } from './Tooltip'
import type { TooltipPosition } from './Tooltip'

type InputFieldTooltipProps =
  | {
      enableTooltip: true
      tooltipTitle: string
      tooltipBody: string
      tooltipPosition: TooltipPosition
    }
  | {
      enableTooltip?: false
      tooltipTitle?: never
      tooltipBody?: never
      tooltipPosition?: never
    }

type InputFieldProps = React.ComponentProps<typeof Input> &
  InputFieldTooltipProps & {
    label: string
    error?: string
    placeholder?: string
  }

const InputField = ({
  id,
  label,
  error,
  placeholder,
  enableTooltip,
  tooltipTitle,
  tooltipBody,
  tooltipPosition,
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
      <div className="flex min-h-7 items-center gap-1">
        <Label
          htmlFor={inputId}
          className={cn(disabled && 'text-muted-foreground')}
        >
          {label}
        </Label>
        {enableTooltip ? (
          <Tooltip
            position={tooltipPosition}
            title={tooltipTitle}
            body={tooltipBody}
          />
        ) : null}
      </div>
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
