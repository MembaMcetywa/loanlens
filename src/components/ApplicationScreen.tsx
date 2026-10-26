import type { FormEvent, ReactNode } from 'react'

import loanLensLogo from '@/assets/loanlens-logo.svg'
import { Button } from '@/components/ui/button'
import { Stepper } from '@/components/ui/Stepper'
import { useNavigate } from '@tanstack/react-router'

type ApplicationScreenProps = {
  currentStep: number
  totalSteps: number
  title: ReactNode
  pageSubTitle?: string
  children: ReactNode
  onBack: () => void
  onContinue: () => void
  continueLabel?: string
  isSubmitting?: boolean
}

type EligibilityFlowData = Record<string, string>

type EligibilityFlowScreenProps = {
  stepNumber: number
  totalSteps: number
  pageTitle: string
  pageSubTitle?: string
  data: EligibilityFlowData
  onBack: () => void
  onContinue: (data: EligibilityFlowData) => void
}

const ApplicationScreen = ({
  currentStep,
  totalSteps,
  title,
  pageSubTitle,
  children,
  onBack,
  onContinue,
  continueLabel = 'Continue',
  isSubmitting = false,
}: ApplicationScreenProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onContinue()
  }

  const navigate = useNavigate()

  const handleNaivgateHome = () => {
    void navigate({ to: '/' })
  }

  return (
    <main className="min-h-screen px-(--layout-page-inline) py-(--layout-page-block)">
      <div className="mx-auto w-full max-w-5xl">
        <img
          src={loanLensLogo}
          alt="LoanLens"
          className="h-8 w-auto sm:h-9 cursor-pointer"
          onClick={handleNaivgateHome}
        />

        <div className="mx-auto mt-(--layout-flow-start) w-full max-w-4xl">
          <Stepper currentStep={currentStep} totalSteps={totalSteps} />

          <header className="mx-auto mt-(--layout-section-gap) max-w-2xl text-center">
            <h1 className="font-heading text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            {pageSubTitle ? (
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {pageSubTitle}
              </p>
            ) : null}
          </header>

          <form
            className="mt-(--layout-content-gap)"
            noValidate
            onSubmit={handleSubmit}
          >
            {children}

            <div className="mt-(--layout-action-gap) grid gap-3 sm:flex sm:flex-row-reverse sm:justify-start">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                loading={isSubmitting}
              >
                {continueLabel}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={onBack}
              >
                Back
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export { ApplicationScreen }
export type {
  ApplicationScreenProps,
  EligibilityFlowData,
  EligibilityFlowScreenProps,
}
