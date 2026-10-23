type EmploymentStatus = 'employed' | 'self_employed' | 'unemployed' | 'retired'

type LoanProductId = 'personal_loan' | 'vehicle_loan'

type LoanPurpose =
  | 'home_improvement'
  | 'education'
  | 'medical'
  | 'other'
  | 'new_vehicle'
  | 'used_vehicle'

type RiskCategory = 'low' | 'medium' | 'high'

type AffordabilityScore = 'good' | 'fair' | 'poor'

type PersonalInformation = {
  age: number
  employmentStatus: EmploymentStatus
  employmentDuration?: number
}

type FinancialInformation = {
  monthlyIncome: number
  monthlyExpenses: number
  existingDebt: number
  creditScore: number
}

type LoanDetails = {
  requestedAmount: number
  loanTerm: number
  loanPurpose: LoanPurpose
}

type LoanEligibilityRequest = {
  personalInfo: PersonalInformation
  financialInfo: FinancialInformation
  loanDetails: LoanDetails
}

type EligibilityResult = {
  isEligible: boolean
  approvalLikelihood: number
  riskCategory: RiskCategory
  decisionReason: string
}

type RecommendedLoan = {
  maxAmount: number
  recommendedAmount: number
  interestRate?: number
  monthlyPayment?: number
  totalRepayment?: number
}

type AffordabilityAnalysis = {
  disposableIncome: number
  debtToIncomeRatio: number
  loanToIncomeRatio: number
  affordabilityScore: AffordabilityScore
}

type LoanEligibilityResponse = {
  eligibilityResult: EligibilityResult
  recommendedLoan: RecommendedLoan
  affordabilityAnalysis: AffordabilityAnalysis
}

type InterestRateRange = {
  min: number
  max: number
}

type LoanProduct = {
  id: LoanProductId
  name: string
  description: string
  minAmount: number
  maxAmount: number
  minTerm: number
  maxTerm: number
  interestRateRange: InterestRateRange
  purposes: LoanPurpose[]
}

type LoanProductsResponse = {
  products: LoanProduct[]
}

type InterestRateCalculationRequest = {
  loanAmount: number
  loanTerm: number
  creditScore: number
  loanType: LoanProductId
}

type PaymentScheduleEntry = {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

type InterestRateCalculationResponse = {
  interestRate: number
  monthlyPayment: number
  totalInterest: number
  totalRepayment: number
  paymentSchedule: PaymentScheduleEntry[]
}

export type {
  AffordabilityAnalysis,
  AffordabilityScore,
  EligibilityResult,
  EmploymentStatus,
  FinancialInformation,
  InterestRateCalculationRequest,
  InterestRateCalculationResponse,
  InterestRateRange,
  LoanDetails,
  LoanEligibilityRequest,
  LoanEligibilityResponse,
  LoanProduct,
  LoanProductId,
  LoanProductsResponse,
  LoanPurpose,
  PaymentScheduleEntry,
  PersonalInformation,
  RecommendedLoan,
  RiskCategory,
}
