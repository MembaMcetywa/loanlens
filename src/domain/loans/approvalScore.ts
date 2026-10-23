import type {
  AffordabilityScore,
  EmploymentStatus,
  RiskCategory,
} from '@/types/loan'

type ApprovalScoreInput = {
  creditScore: number
  debtToIncomeRatio: number
  paymentToDisposableIncomeRatio: number
  combinedDebtToIncomeRatio: number
  employmentStatus: EmploymentStatus
  employmentDuration?: number
  loanToIncomeRatio: number
}

const creditScoreBands = [
  { minimum: 750, points: 100 },
  { minimum: 700, points: 90 },
  { minimum: 650, points: 75 },
  { minimum: 600, points: 55 },
  { minimum: 550, points: 40 },
  { minimum: 300, points: 20 },
]

const debtToIncomeBands = [
  { maximum: 20, points: 100 },
  { maximum: 30, points: 85 },
  { maximum: 40, points: 70 },
  { maximum: 50, points: 50 },
]

const paymentUseBands = [
  { maximum: 50, points: 100 },
  { maximum: 65, points: 90 },
  { maximum: 75, points: 80 },
  { maximum: 90, points: 60 },
  { maximum: 100, points: 40 },
]

const combinedDebtToIncomeBands = [
  { maximum: 30, points: 100 },
  { maximum: 40, points: 85 },
  { maximum: 45, points: 70 },
  { maximum: 50, points: 60 },
]

const loanToIncomeBands = [
  { maximum: 50, points: 100 },
  { maximum: 75, points: 85 },
  { maximum: 100, points: 70 },
  { maximum: 150, points: 50 },
  { maximum: Number.POSITIVE_INFINITY, points: 30 },
]

function calculateApprovalScore(input: ApprovalScoreInput) {
  const {
    creditScore,
    debtToIncomeRatio,
    paymentToDisposableIncomeRatio,
    combinedDebtToIncomeRatio,
    employmentStatus,
    employmentDuration = 0,
    loanToIncomeRatio,
  } = input
  const isWorking = ['employed', 'self_employed'].includes(employmentStatus)
  const creditScorePoints =
    creditScoreBands.find((band) => creditScore >= band.minimum)?.points ?? 0
  const debtToIncomePoints =
    debtToIncomeBands.find((band) => debtToIncomeRatio <= band.maximum)
      ?.points ?? 0
  const paymentUsePoints =
    paymentUseBands.find(
      (band) => paymentToDisposableIncomeRatio <= band.maximum,
    )?.points ?? 0
  const combinedDebtToIncomePoints =
    combinedDebtToIncomeBands.find(
      (band) => combinedDebtToIncomeRatio <= band.maximum,
    )?.points ?? 0
  const loanLeveragePoints =
    loanToIncomeBands.find((band) => loanToIncomeRatio <= band.maximum)
      ?.points ?? 0
  const employment = [
    { applies: employmentStatus === 'retired', points: 75, hardFailure: false },
    {
      applies: employmentStatus === 'unemployed',
      points: 0,
      hardFailure: true,
    },
    {
      applies: isWorking && employmentDuration >= 24,
      points: 100,
      hardFailure: false,
    },
    {
      applies: isWorking && employmentDuration >= 12,
      points: 85,
      hardFailure: false,
    },
    {
      applies: isWorking && employmentDuration >= 6,
      points: 70,
      hardFailure: false,
    },
    {
      applies: isWorking && employmentDuration >= 3,
      points: 50,
      hardFailure: false,
    },
  ].find((band) => band.applies) ?? { points: 0, hardFailure: true }
  const affordabilityPoints =
    (paymentUsePoints + combinedDebtToIncomePoints) / 2
  const approvalScore = Math.round(
    creditScorePoints * 0.3 +
      debtToIncomePoints * 0.2 +
      affordabilityPoints * 0.25 +
      employment.points * 0.15 +
      loanLeveragePoints * 0.1,
  )
  const riskCategory: RiskCategory =
    approvalScore >= 80 ? 'low' : approvalScore >= 60 ? 'medium' : 'high'
  const affordabilityScore: AffordabilityScore =
    affordabilityPoints >= 70
      ? 'good'
      : affordabilityPoints >= 50
        ? 'fair'
        : 'poor'

  return {
    approvalScore,
    riskCategory,
    affordabilityScore,
    hasHardFailure:
      debtToIncomePoints === 0 ||
      paymentUsePoints === 0 ||
      combinedDebtToIncomePoints === 0 ||
      employment.hardFailure,
    scoreBreakdown: {
      creditScore: creditScorePoints,
      debtToIncome: debtToIncomePoints,
      affordability: affordabilityPoints,
      employment: employment.points,
      loanLeverage: loanLeveragePoints,
    },
  }
}

export { calculateApprovalScore }
