import { describe, expect, it } from 'vitest'

import { calculateAffordability } from '@/domain/affordability'
import {
  calculateAmortisation,
  calculateMonthlyPayment,
} from '@/domain/amortisation'
import { calculateApprovalScore } from '@/domain/approvalScore'
import {
  calculateInterestRate,
  findLoanProduct,
  findLoanProductByPurpose,
} from '@/domain/products'
import type { LoanEligibilityRequest, LoanProduct } from '@/types/loan'

function getPersonalLoan(): LoanProduct {
  const product = findLoanProduct('personal_loan')

  if (!product) {
    throw new Error('Personal loan product is missing')
  }

  return product
}

function createRequest(): LoanEligibilityRequest {
  return {
    personalInfo: {
      age: 35,
      employmentStatus: 'employed',
      employmentDuration: 36,
    },
    financialInfo: {
      monthlyIncome: 25_000,
      monthlyExpenses: 10_000,
      existingDebt: 2_000,
      creditScore: 700,
    },
    loanDetails: {
      requestedAmount: 150_000,
      loanTerm: 24,
      loanPurpose: 'home_improvement',
    },
  }
}

describe('loan product pricing', () => {
  it('resolves products from the selected product and purpose', () => {
    expect(findLoanProduct('personal_loan')?.name).toBe('Personal Loan')
    expect(findLoanProductByPurpose('used_vehicle')?.id).toBe('vehicle_loan')
  })

  it.each([
    [750, 10.5],
    [700, 11.5],
    [650, 12.5],
    [600, 14.5],
    [550, 16.5],
    [300, 18.5],
  ])('prices a credit score of %i at %f%%', (creditScore, expectedRate) => {
    expect(calculateInterestRate(creditScore, getPersonalLoan())).toBe(
      expectedRate,
    )
  })
})

describe('affordability', () => {
  it('derives the available income and affordability limits', () => {
    const result = calculateAffordability(createRequest(), 5_000)

    expect(result.disposableIncome).toBe(15_000)
    expect(result.debtToIncomeRatio).toBe(8)
    expect(result.combinedDebtToIncomeRatio).toBeCloseTo(28, 2)
    expect(result.paymentToDisposableIncomeRatio).toBeCloseTo(33.33, 2)
    expect(result.maximumPayment).toBe(10_500)
    expect(result.loanToIncomeRatio).toBe(50)
    expect(result.isAffordable).toBe(true)
  })

  it('rejects a payment above the calculated limit', () => {
    expect(calculateAffordability(createRequest(), 11_000).isAffordable).toBe(
      false,
    )
  })
})

describe('approval scoring', () => {
  it('classifies a strong application as low risk and affordable', () => {
    const result = calculateApprovalScore({
      creditScore: 780,
      debtToIncomeRatio: 15,
      paymentToDisposableIncomeRatio: 40,
      combinedDebtToIncomeRatio: 25,
      employmentStatus: 'employed',
      employmentDuration: 36,
      loanToIncomeRatio: 40,
    })

    expect(result.approvalScore).toBe(100)
    expect(result.riskCategory).toBe('low')
    expect(result.affordabilityScore).toBe('good')
    expect(result.hasHardFailure).toBe(false)
  })

  it('marks an unemployed applicant as a hard failure', () => {
    const result = calculateApprovalScore({
      creditScore: 780,
      debtToIncomeRatio: 15,
      paymentToDisposableIncomeRatio: 40,
      combinedDebtToIncomeRatio: 25,
      employmentStatus: 'unemployed',
      loanToIncomeRatio: 40,
    })

    expect(result.hasHardFailure).toBe(true)
    expect(result.scoreBreakdown.employment).toBe(0)
  })
})

describe('amortisation', () => {
  it('splits a zero-interest loan into equal payments', () => {
    expect(calculateMonthlyPayment(12_000, 12, 0)).toBe(1_000)
  })

  it('produces a complete schedule that clears the balance', () => {
    const result = calculateAmortisation(150_000, 24, 12.5)
    const principalRepaid = result.paymentSchedule.reduce(
      (total, payment) => total + payment.principal,
      0,
    )

    expect(result.monthlyPayment).toBeCloseTo(7_096.1, 2)
    expect(result.paymentSchedule).toHaveLength(24)
    expect(result.paymentSchedule.at(-1)?.balance).toBe(0)
    expect(principalRepaid).toBeCloseTo(150_000, 2)
    expect(result.totalRepayment).toBeGreaterThan(150_000)
    expect(result.totalInterest).toBeGreaterThan(0)
  })
})
