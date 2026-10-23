import type { InterestRateCalculationResponse } from '@/types/loan'

function roundCurrency(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100
}

function calculateMonthlyPayment(
  loanAmount: number,
  loanTerm: number,
  interestRate: number,
): number {
  const monthlyRate = interestRate / 100 / 12

  if (monthlyRate === 0) {
    return loanAmount / loanTerm
  }

  const compoundRate = (1 + monthlyRate) ** loanTerm

  return (loanAmount * monthlyRate * compoundRate) / (compoundRate - 1)
}

function calculateAmortization(
  loanAmount: number,
  loanTerm: number,
  interestRate: number,
): InterestRateCalculationResponse {
  const monthlyRate = interestRate / 100 / 12
  const monthlyPayment = roundCurrency(
    calculateMonthlyPayment(loanAmount, loanTerm, interestRate),
  )
  let balance = roundCurrency(loanAmount)

  const paymentSchedule = Array.from({ length: loanTerm }, (_, index) => {
    const interest = roundCurrency(balance * monthlyRate)
    const isFinalPayment = index === loanTerm - 1
    const payment = isFinalPayment
      ? roundCurrency(balance + interest)
      : monthlyPayment
    const principal = isFinalPayment
      ? balance
      : roundCurrency(payment - interest)

    balance = isFinalPayment ? 0 : roundCurrency(balance - principal)

    return {
      month: index + 1,
      payment,
      principal,
      interest,
      balance,
    }
  })

  const totalRepayment = roundCurrency(
    paymentSchedule.reduce((total, payment) => total + payment.payment, 0),
  )
  const totalInterest = roundCurrency(
    paymentSchedule.reduce((total, payment) => total + payment.interest, 0),
  )

  return {
    interestRate,
    monthlyPayment,
    totalInterest,
    totalRepayment,
    paymentSchedule,
  }
}

export { calculateAmortization, calculateMonthlyPayment }
