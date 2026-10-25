import type { LoanProduct, LoanProductId, LoanPurpose } from '@/types/loan'

const creditScoreBands = [
  { minimumScore: 750, ratePosition: 0 },
  { minimumScore: 700, ratePosition: 0.125 },
  { minimumScore: 650, ratePosition: 0.25 },
  { minimumScore: 600, ratePosition: 0.5 },
  { minimumScore: 550, ratePosition: 0.75 },
  { minimumScore: 300, ratePosition: 1 },
]

const loanProducts: LoanProduct[] = [
  {
    id: 'personal_loan',
    name: 'Personal Loan',
    description: 'Flexible personal financing for various needs',
    minAmount: 5000,
    maxAmount: 300000,
    minTerm: 6,
    maxTerm: 60,
    interestRateRange: {
      min: 10.5,
      max: 18.5,
    },
    purposes: ['home_improvement', 'education', 'medical', 'other'],
  },
  {
    id: 'vehicle_loan',
    name: 'Vehicle Finance',
    description: 'Financing for new and used vehicles',
    minAmount: 50000,
    maxAmount: 1500000,
    minTerm: 12,
    maxTerm: 72,
    interestRateRange: {
      min: 8.5,
      max: 15,
    },
    purposes: ['new_vehicle', 'used_vehicle'],
  },
]

function findLoanProduct(id: LoanProductId): LoanProduct | undefined {
  return loanProducts.find((product) => product.id === id)
}

function findLoanProductByPurpose(
  purpose: LoanPurpose,
): LoanProduct | undefined {
  return loanProducts.find((product) => product.purposes.includes(purpose))
}

function calculateInterestRate(
  creditScore: number,
  product: LoanProduct,
): number {
  const ratePosition = creditScoreBands.find(
    (band) => creditScore >= band.minimumScore,
  )?.ratePosition
  const { min, max } = product.interestRateRange

  return min + (max - min) * (ratePosition ?? 1)
}

export {
  calculateInterestRate,
  findLoanProduct,
  findLoanProductByPurpose,
  loanProducts,
}
