import { calculateAffordability } from '@/domain/loans/affordability'
import { calculateMonthlyPayment } from '@/domain/loans/amortization'
import { calculateApprovalScore } from '@/domain/loans/approvalScore'
import { calculateInterestRate } from '@/domain/loans/products'
import type { LoanEligibilityRequest, LoanProduct } from '@/types/loan'

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

  return {
    loanAmount,
    interestRate,
    monthlyPayment,
    affordability,
    score,
    isEligible:
      affordability.isAffordable &&
      !score.hasHardFailure &&
      score.approvalScore >= 60,
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

export { evaluateLoanAmount, findMaximumEligibleAmount }
