import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useLoanApplicationStore } from '@/stores/loanApplicationStore'

const Application = () => {
  const navigate = useNavigate()
  const activeStepId = useLoanApplicationStore((state) => state.activeStepId)
  const eligibilityFlow = useLoanApplicationStore(
    (state) => state.eligibilityFlow,
  )
  const completeCurrentStep = useLoanApplicationStore(
    (state) => state.completeCurrentStep,
  )
  const goToPreviousStep = useLoanApplicationStore(
    (state) => state.goToPreviousStep,
  )
  const activeStep = eligibilityFlow.find((step) => step.id === activeStepId)
  const totalSteps = eligibilityFlow.filter((step) => step.showInStepper).length

  if (!activeStep) {
    return null
  }

  const ActiveScreen = activeStep.component

  const handleBack = () => {
    if (!goToPreviousStep()) {
      void navigate({ to: '/' })
    }
  }

  return (
    <ActiveScreen
      stepNumber={activeStep.stepNumber}
      totalSteps={totalSteps}
      pageTitle={activeStep.pageTitle}
      pageSubTitle={activeStep.pageSubTitle}
      data={activeStep.data}
      onBack={handleBack}
      onContinue={completeCurrentStep}
    />
  )
}

export const Route = createFileRoute('/application')({
  component: Application,
})
