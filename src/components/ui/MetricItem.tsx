import * as React from 'react'
import { cn } from 'cn'

type MetricItemProps = React.ComponentProps<'div'> & {
  label: string
  value: React.ReactNode
}

const MetricItem = ({ label, value, className, ...props }: MetricItemProps) => {
  return (
    <div className={cn('grid gap-1', className)} {...props}>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="m-0 text-lg font-semibold text-foreground">{value}</dd>
    </div>
  )
}

export { MetricItem }
export type { MetricItemProps }
