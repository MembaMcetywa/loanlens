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
        {Array.from({ length: totalSteps }, (_, index) => (
          <span
            key={index}
            className={cn(
              'h-1 flex-1 rounded-full',
              index < currentStep ? 'bg-primary' : 'bg-muted',
            )}
          />
        ))}
      </div>
    </div>
  )
}

export { Stepper }
export type { StepperProps }
