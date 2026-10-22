import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { XIcon } from 'lucide-react'

const alertVariants = cva(
  "group/alert relative grid w-full gap-1 rounded-lg border px-4 py-3 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-data-[slot=alert-close]:pr-16 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-3 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: 'border-border bg-card text-card-foreground',
        success:
          'border-primary/20 bg-accent text-accent-foreground *:data-[slot=alert-description]:text-accent-foreground/80',
        destructive:
          'border-destructive/25 bg-destructive/5 text-destructive *:data-[slot=alert-description]:text-destructive *:[svg]:text-current',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const Alert = ({
  className,
  variant,
  dismissible = true,
  onDismiss,
  children,
  role,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof alertVariants> & {
    dismissible?: boolean
    onDismiss?: () => void
  }) => {
  const [visible, setVisible] = React.useState(true)
  const announcementRole =
    role ??
    (variant === 'destructive'
      ? 'alert'
      : variant === 'success'
        ? 'status'
        : undefined)

  const dismissAlert = () => {
    setVisible(false)
    onDismiss?.()
  }

  if (!visible) {
    return null
  }

  return (
    <div
      data-slot="alert"
      role={announcementRole}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {children}
      {dismissible ? (
        <button
          type="button"
          data-slot="alert-close"
          className="absolute top-2 right-2 inline-flex size-11 cursor-pointer items-center justify-center rounded-full opacity-70 outline-none transition-colors hover:bg-foreground/5 hover:opacity-100 focus-visible:ring-1 focus-visible:ring-ring"
          aria-label="Close alert"
          onClick={dismissAlert}
        >
          <XIcon className="size-4" />
        </button>
      ) : null}
    </div>
  )
}

const AlertTitle = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'font-semibold group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground',
        className,
      )}
      {...props}
    />
  )
}

const AlertDescription = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4',
        className,
      )}
      {...props}
    />
  )
}

const AlertAction = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="alert-action"
      className={cn('absolute top-2 right-2', className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
