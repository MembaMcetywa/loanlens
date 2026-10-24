import { cn } from 'cn'

type StepperProps = {
  currentStep: number
  totalSteps: number
  className?: string
}

const Stepper = ({ currentStep, totalSteps, className }: StepperProps) => {
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-lg flex-col items-center gap-3',
        className,
      )}
      role="progressbar"
      aria-label="Application progress"
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-valuenow={currentStep}
      aria-valuetext={`Step ${currentStep} of ${totalSteps}`}
    >
      <p className="text-sm font-medium text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </p>
      <div className="flex w-full gap-2" aria-hidden="true">
        {Array.from({ length: totalSteps }, (_, index) => {
          const isReached = index < currentStep
          const isCurrent = index === currentStep - 1

          return (
            <span
              key={index}
              className="h-1 flex-1 overflow-hidden rounded-full bg-muted"
            >
              <span
                className={cn(
                  'block h-full rounded-full bg-primary',
                  isCurrent
                    ? 'w-0 animate-step-fill'
                    : isReached
                      ? 'w-full'
                      : 'w-0',
                )}
              />
            </span>
          )
        })}
      </div>
    </div>
  )
}

export { Stepper }
export type { StepperProps }
