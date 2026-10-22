import * as React from 'react'
import { cn } from 'cn'

const Input = ({
  className,
  type,
  ...props
}: React.ComponentProps<'input'>) => {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-12 w-full min-w-0 rounded-lg border border-input bg-card px-4 py-2.5 text-base text-foreground transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground enabled:hover:border-ring focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive aria-invalid:hover:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
