import type { LoanEligibilityRequest } from '@/types/loan'

function calculateAffordability(
  request: LoanEligibilityRequest,
  proposedMonthlyPayment: number,
) {
  const { monthlyIncome, monthlyExpenses, existingDebt } = request.financialInfo
  const { requestedAmount } = request.loanDetails
  const disposableIncome = monthlyIncome - monthlyExpenses
  const debtToIncomeRatio = (existingDebt / monthlyIncome) * 100
  const combinedDebtToIncomeRatio =
    ((existingDebt + proposedMonthlyPayment) / monthlyIncome) * 100
  const paymentToDisposableIncomeRatio =
    disposableIncome > 0
      ? (proposedMonthlyPayment / disposableIncome) * 100
      : Number.POSITIVE_INFINITY
  const maximumPayment = Math.min(
    disposableIncome,
    monthlyIncome * 0.5 - existingDebt,
  )
  const loanToIncomeRatio = (requestedAmount / (monthlyIncome * 12)) * 100

  return {
    disposableIncome,
    debtToIncomeRatio,
    combinedDebtToIncomeRatio,
    paymentToDisposableIncomeRatio,
    maximumPayment,
    loanToIncomeRatio,
    isAffordable: proposedMonthlyPayment <= maximumPayment,
  }
}

export { calculateAffordability }
