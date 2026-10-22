import type { ComponentType } from 'react'
import { create } from 'zustand'

import { ApplicantDetailsScreen } from '@/components/ApplicantDetailsScreen'
import type { EligibilityFlowScreenProps } from '@/components/ApplicationScreen'
import { EligibilityResultScreen } from '@/components/EligibilityResultScreen'
import { FinancialDetailsScreen } from '@/components/FinancialDetailsScreen'
import { LoanDetailsScreen } from '@/components/LoanDetailsScreen'

type EligibilityFlowStep = {
  id: number
  stepNumber: number
  pageTitle: string
  pageSubTitle?: string
  component: ComponentType<EligibilityFlowScreenProps>
  isComplete: boolean
}

type LoanApplicationState = {
  activeStepId: number
  eligibilityFlow: EligibilityFlowStep[]
  completeCurrentStep: () => void
  goToPreviousStep: () => boolean
}

const eligibilityFlow: EligibilityFlowStep[] = [
  {
    id: 0,
    stepNumber: 1,
    pageTitle: 'Tell us about yourself',
    pageSubTitle: 'Start with your personal and employment details.',
    component: ApplicantDetailsScreen,
    isComplete: false,
  },
  {
    id: 1,
    stepNumber: 2,
    pageTitle: 'Your monthly finances',
    pageSubTitle:
      'Tell us about your income, expenses, debt, and credit score.',
    component: FinancialDetailsScreen,
    isComplete: false,
  },
  {
    id: 2,
    stepNumber: 3,
    pageTitle: 'Choose your loan',
    pageSubTitle:
      'Select a product, amount, term, and purpose for your estimate.',
    component: LoanDetailsScreen,
    isComplete: false,
  },
  {
    id: 3,
    stepNumber: 4,
    pageTitle: 'Your estimated loan result',
    pageSubTitle: 'Review your estimated eligibility and loan terms.',
    component: EligibilityResultScreen,
    isComplete: false,
  },
]

const useLoanApplicationStore = create<LoanApplicationState>(
  function createLoanApplicationState(set, get) {
    return {
      activeStepId: eligibilityFlow[0].id,
      eligibilityFlow,
      completeCurrentStep() {
        const { activeStepId, eligibilityFlow: currentFlow } = get()
        const activeStepIndex = currentFlow.findIndex(
          function findActiveStep(step) {
            return step.id === activeStepId
          },
        )
        const hasNextStep = activeStepIndex < currentFlow.length - 1
        const nextStepId = hasNextStep
          ? currentFlow[activeStepIndex + 1].id
          : activeStepId

        set({
          activeStepId: nextStepId,
          eligibilityFlow: currentFlow.map(function completeActiveStep(step) {
            return step.id === activeStepId
              ? { ...step, isComplete: true }
              : step
          }),
        })
      },
      goToPreviousStep() {
        const { activeStepId, eligibilityFlow: currentFlow } = get()
        const activeStepIndex = currentFlow.findIndex(
          function findActiveStep(step) {
            return step.id === activeStepId
          },
        )
        if (activeStepIndex <= 0) {
          return false
        }

        set({ activeStepId: currentFlow[activeStepIndex - 1].id })
        return true
      },
    }
  },
)

export { useLoanApplicationStore }
export type { EligibilityFlowStep, LoanApplicationState }
