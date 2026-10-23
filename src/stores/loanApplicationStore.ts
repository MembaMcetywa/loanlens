import type { ComponentType } from 'react'
import { create } from 'zustand'

import { ApplicantDetailsScreen } from '@/components/ApplicantDetailsScreen'
import type {
  EligibilityFlowData,
  EligibilityFlowScreenProps,
} from '@/components/ApplicationScreen'
import { EligibilityResultScreen } from '@/components/EligibilityResultScreen'
import { FinancialDetailsScreen } from '@/components/FinancialDetailsScreen'
import { LoanDetailsScreen } from '@/components/LoanDetailsScreen'
import type {
  EmploymentStatus,
  LoanEligibilityRequest,
  LoanEligibilityResponse,
  LoanPurpose,
} from '@/types/loan'

type EligibilityFlowStep = {
  id: number
  stepNumber: number
  showInStepper: boolean
  pageTitle: string
  pageSubTitle?: string
  component: ComponentType<EligibilityFlowScreenProps>
  isComplete: boolean
  data: EligibilityFlowData
}

type LoanApplicationState = {
  activeStepId: number
  eligibilityFlow: EligibilityFlowStep[]
  eligibilityResult: LoanEligibilityResponse | null
  completeCurrentStep: (data: EligibilityFlowData) => void
  createLoanEligibilityRequest: () => LoanEligibilityRequest
  saveCurrentStep: (data: EligibilityFlowData) => void
  setEligibilityResult: (result: LoanEligibilityResponse) => void
  goToPreviousStep: () => boolean
  resetApplication: () => void
}

function createInitialEligibilityFlow(): EligibilityFlowStep[] {
  return [
    {
      id: 0,
      stepNumber: 1,
      showInStepper: true,
      pageTitle: 'Tell us about yourself',
      pageSubTitle: 'Start with your personal and employment details.',
      component: ApplicantDetailsScreen,
      isComplete: false,
      data: {
        firstName: '',
        surname: '',
        age: '',
        employmentStatus: '',
        companyName: '',
        employmentDuration: '',
      },
    },
    {
      id: 1,
      stepNumber: 2,
      showInStepper: true,
      pageTitle: 'Your monthly finances',
      pageSubTitle:
        'Tell us about your income, expenses, debt, and credit score.',
      component: FinancialDetailsScreen,
      isComplete: false,
      data: {
        monthlyIncome: '',
        monthlyExpenses: '',
        existingDebt: '',
        creditScore: '',
      },
    },
    {
      id: 2,
      stepNumber: 3,
      showInStepper: true,
      pageTitle: 'Choose your loan',
      pageSubTitle:
        'Select a product, amount, term, and purpose for your estimate.',
      component: LoanDetailsScreen,
      isComplete: false,
      data: {
        loanProduct: '',
        loanPurpose: '',
        requestedAmount: '',
        loanTerm: '',
      },
    },
    {
      id: 3,
      stepNumber: 4,
      showInStepper: false,
      pageTitle: 'Your estimated loan result',
      pageSubTitle: 'Review your estimated eligibility and loan terms.',
      component: EligibilityResultScreen,
      isComplete: false,
      data: {},
    },
  ]
}

const useLoanApplicationStore = create<LoanApplicationState>(
  function createLoanApplicationState(set, get) {
    const initialEligibilityFlow = createInitialEligibilityFlow()

    return {
      activeStepId: initialEligibilityFlow[0].id,
      eligibilityFlow: initialEligibilityFlow,
      eligibilityResult: null,
      completeCurrentStep(data) {
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
              ? { ...step, isComplete: true, data }
              : step
          }),
        })
      },
      createLoanEligibilityRequest() {
        const { eligibilityFlow: currentFlow } = get()
        const applicantDetails = currentFlow[0].data
        const financialDetails = currentFlow[1].data
        const loanDetails = currentFlow[2].data

        return {
          personalInfo: {
            age: Number(applicantDetails.age),
            employmentStatus:
              applicantDetails.employmentStatus as EmploymentStatus,
            employmentDuration: applicantDetails.employmentDuration
              ? Number(applicantDetails.employmentDuration)
              : undefined,
          },
          financialInfo: {
            monthlyIncome: Number(financialDetails.monthlyIncome),
            monthlyExpenses: Number(financialDetails.monthlyExpenses),
            existingDebt: Number(financialDetails.existingDebt),
            creditScore: Number(financialDetails.creditScore),
          },
          loanDetails: {
            requestedAmount: Number(loanDetails.requestedAmount),
            loanTerm: Number(loanDetails.loanTerm),
            loanPurpose: loanDetails.loanPurpose as LoanPurpose,
          },
        }
      },
      saveCurrentStep(data) {
        const { activeStepId, eligibilityFlow: currentFlow } = get()

        set({
          eligibilityFlow: currentFlow.map(function saveActiveStep(step) {
            return step.id === activeStepId ? { ...step, data } : step
          }),
        })
      },
      setEligibilityResult(result) {
        set({ eligibilityResult: result })
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
      // resets the loan application flow + any persisted data to the initial state
      resetApplication() {
        const resetFlow = createInitialEligibilityFlow()

        set({
          activeStepId: resetFlow[0].id,
          eligibilityFlow: resetFlow,
          eligibilityResult: null,
        })
      },
    }
  },
)

export { useLoanApplicationStore }
export type { EligibilityFlowStep, LoanApplicationState }
