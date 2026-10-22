import { cn } from 'cn'
import { Loader2Icon } from 'lucide-react'

type SpinnerProps = React.ComponentProps<'svg'> & {
  label?: string
}

const Spinner = ({ className, label = 'Loading', ...props }: SpinnerProps) => {
  return (
    <Loader2Icon
      data-slot="spinner"
      role="status"
      aria-label={label}
      className={cn(
        'size-5 animate-spin text-primary motion-reduce:animate-none',
        className,
      )}
      {...props}
    />
  )
}

export { Spinner }
export type { SpinnerProps }
