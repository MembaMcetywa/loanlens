import { describe, expect, it } from 'vitest'

import { calculateLoanEligibility } from '@/domain/eligibilityEngine'
import { findLoanProduct } from '@/domain/products'
import type { LoanEligibilityRequest, LoanProduct } from '@/types/loan'

function getPersonalLoan(): LoanProduct {
  const product = findLoanProduct('personal_loan')

  if (!product) {
    throw new Error('Personal loan product is missing')
  }

  return product
}

function createRequest(requestedAmount = 150_000): LoanEligibilityRequest {
  return {
    personalInfo: {
      age: 35,
      employmentStatus: 'employed',
      employmentDuration: 36,
    },
    financialInfo: {
      monthlyIncome: 25_000,
      monthlyExpenses: 10_000,
      existingDebt: 3_000,
      creditScore: 700,
    },
    loanDetails: {
      requestedAmount,
      loanTerm: 24,
      loanPurpose: 'home_improvement',
    },
  }
}

describe('loan eligibility decision', () => {
  it('approves a qualifying requested amount', () => {
    const request = createRequest()
    const result = calculateLoanEligibility(request, getPersonalLoan())

    expect(result.eligibilityResult.isEligible).toBe(true)
    expect(result.eligibilityResult.decisionReason).toBe(
      'The requested loan amount meets the eligibility requirements',
    )
    expect(result.recommendedLoan.recommendedAmount).toBe(
      request.loanDetails.requestedAmount,
    )
    expect(result.recommendedLoan.monthlyPayment).toBeGreaterThan(0)
    expect(result.recommendedLoan.totalRepayment).toBeGreaterThan(
      request.loanDetails.requestedAmount,
    )
  })

  it('offers a lower qualifying amount when the request is too high', () => {
    const request = createRequest(300_000)
    const result = calculateLoanEligibility(request, getPersonalLoan())

    expect(result.eligibilityResult.isEligible).toBe(false)
    expect(result.eligibilityResult.decisionReason).toBe(
      'The requested amount exceeds the maximum qualifying amount',
    )
    expect(result.recommendedLoan.maxAmount).toBeGreaterThan(0)
    expect(result.recommendedLoan.maxAmount).toBeLessThan(
      request.loanDetails.requestedAmount,
    )
    expect(result.recommendedLoan.maxAmount % 100).toBe(0)
    expect(result.recommendedLoan.recommendedAmount).toBe(
      result.recommendedLoan.maxAmount,
    )
  })

  it('returns no loan recommendation for an unemployed applicant', () => {
    const request = createRequest()
    request.personalInfo = {
      age: request.personalInfo.age,
      employmentStatus: 'unemployed',
    }
    const result = calculateLoanEligibility(request, getPersonalLoan())

    expect(result.eligibilityResult.isEligible).toBe(false)
    expect(result.eligibilityResult.decisionReason).toBe(
      'Employment status is not eligible',
    )
    expect(result.recommendedLoan).toEqual({
      maxAmount: 0,
      recommendedAmount: 0,
    })
  })

  it('returns the same decision for the same input', () => {
    const request = createRequest()
    const product = getPersonalLoan()

    expect(calculateLoanEligibility(request, product)).toEqual(
      calculateLoanEligibility(request, product),
    )
  })
})
