import { calculateAffordability } from '@/domain/affordability'
import {
  calculateAmortisation,
  calculateMonthlyPayment,
} from '#/domain/amortisation'
import { calculateApprovalScore } from '@/domain/approvalScore'
import { calculateInterestRate } from '@/domain/products'
import type {
  LoanEligibilityRequest,
  LoanEligibilityResponse,
  LoanProduct,
} from '@/types/loan'

function evaluateLoanAmount(
  request: LoanEligibilityRequest,
  product: LoanProduct,
  loanAmount: number,
) {
  const candidateRequest = {
    ...request,
    loanDetails: {
      ...request.loanDetails,
      requestedAmount: loanAmount,
    },
  }
  const interestRate = calculateInterestRate(
    request.financialInfo.creditScore,
    product,
  )
  const monthlyPayment = calculateMonthlyPayment(
    loanAmount,
    request.loanDetails.loanTerm,
    interestRate,
  )
  const affordability = calculateAffordability(candidateRequest, monthlyPayment)
  const score = calculateApprovalScore({
    creditScore: request.financialInfo.creditScore,
    debtToIncomeRatio: affordability.debtToIncomeRatio,
    paymentToDisposableIncomeRatio:
      affordability.paymentToDisposableIncomeRatio,
    combinedDebtToIncomeRatio: affordability.combinedDebtToIncomeRatio,
    employmentStatus: request.personalInfo.employmentStatus,
    employmentDuration: request.personalInfo.employmentDuration,
    loanToIncomeRatio: affordability.loanToIncomeRatio,
  })
  const isWorking = ['employed', 'self_employed'].includes(
    request.personalInfo.employmentStatus,
  )
  const failedRules = [
    {
      failed: request.personalInfo.employmentStatus === 'unemployed',
      rule: 'employment_status',
    },
    {
      failed: isWorking && (request.personalInfo.employmentDuration ?? 0) < 3,
      rule: 'employment_duration',
    },
    {
      failed: affordability.debtToIncomeRatio > 50,
      rule: 'existing_debt_to_income',
    },
    {
      failed: affordability.paymentToDisposableIncomeRatio > 100,
      rule: 'payment_to_disposable_income',
    },
    {
      failed: affordability.combinedDebtToIncomeRatio > 50,
      rule: 'combined_debt_to_income',
    },
    {
      failed: score.approvalScore < 60,
      rule: 'approval_score',
    },
  ]
    .filter(({ failed }) => failed)
    .map(({ rule }) => rule)

  return {
    loanAmount,
    interestRate,
    monthlyPayment,
    affordability,
    score,
    failedRules,
    isEligible: failedRules.length === 0,
  }
}

function findMaximumEligibleAmount(
  request: LoanEligibilityRequest,
  product: LoanProduct,
): number {
  let minimumStep = Math.ceil(product.minAmount / 100)
  let maximumStep = Math.floor(product.maxAmount / 100)
  let maximumEligibleAmount = 0

  while (minimumStep <= maximumStep) {
    const candidateStep = Math.floor((minimumStep + maximumStep) / 2)
    const candidateAmount = candidateStep * 100
    const candidate = evaluateLoanAmount(request, product, candidateAmount)

    if (candidate.isEligible) {
      maximumEligibleAmount = candidateAmount
      minimumStep = candidateStep + 1
    } else {
      maximumStep = candidateStep - 1
    }
  }

  return maximumEligibleAmount
}

function calculateLoanEligibility(
  request: LoanEligibilityRequest,
  product: LoanProduct,
): LoanEligibilityResponse {
  const requestedAmount = request.loanDetails.requestedAmount
  const requestedEvaluation = evaluateLoanAmount(
    request,
    product,
    requestedAmount,
  )
  const minimumEvaluation = evaluateLoanAmount(
    request,
    product,
    product.minAmount,
  )
  const maxAmount = findMaximumEligibleAmount(request, product)
  const recommendedAmount = requestedEvaluation.isEligible
    ? requestedAmount
    : maxAmount
  const repayment = recommendedAmount
    ? calculateAmortisation(
        recommendedAmount,
        request.loanDetails.loanTerm,
        requestedEvaluation.interestRate,
      )
    : undefined
  const isWorking = ['employed', 'self_employed'].includes(
    request.personalInfo.employmentStatus,
  )
  const decisionReason = [
    {
      applies: request.personalInfo.employmentStatus === 'unemployed',
      message: 'Employment status is not eligible',
    },
    {
      applies: isWorking && (request.personalInfo.employmentDuration ?? 0) < 3,
      message: 'Minimum 3 months employment required',
    },
    {
      applies: maxAmount === 0 && !minimumEvaluation.affordability.isAffordable,
      message:
        'Income and existing commitments do not support the minimum loan amount',
    },
    {
      applies: maxAmount === 0,
      message: 'The minimum loan amount does not meet the approval threshold',
    },
    {
      applies: !requestedEvaluation.isEligible,
      message: 'The requested amount exceeds the maximum qualifying amount',
    },
  ].find(({ applies }) => applies)?.message

  return {
    eligibilityResult: {
      isEligible: requestedEvaluation.isEligible,
      approvalLikelihood: requestedEvaluation.score.approvalScore,
      riskCategory: requestedEvaluation.score.riskCategory,
      decisionReason:
        decisionReason ??
        'The requested loan amount meets the eligibility requirements',
    },
    recommendedLoan: repayment
      ? {
          maxAmount,
          recommendedAmount,
          interestRate: repayment.interestRate,
          monthlyPayment: repayment.monthlyPayment,
          totalRepayment: repayment.totalRepayment,
        }
      : {
          maxAmount: 0,
          recommendedAmount: 0,
        },
    affordabilityAnalysis: {
      disposableIncome: requestedEvaluation.affordability.disposableIncome,
      debtToIncomeRatio: requestedEvaluation.affordability.debtToIncomeRatio,
      loanToIncomeRatio: requestedEvaluation.affordability.loanToIncomeRatio,
      affordabilityScore: requestedEvaluation.score.affordabilityScore,
    },
  }
}

export {
  calculateLoanEligibility,
  evaluateLoanAmount,
  findMaximumEligibleAmount,
}
