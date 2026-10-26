import { z } from 'zod'

import type { LoanProduct } from '@/types/loan'

function parseNumber(value: unknown) {
  if (typeof value !== 'string') {
    return value
  }

  return value.trim() === '' ? undefined : Number(value)
}

function numberField(schema: z.ZodNumber) {
  return z.preprocess(parseNumber, schema)
}

function requiresEmploymentDetails(employmentStatus: string) {
  return ['employed', 'self_employed'].includes(employmentStatus)
}

const personalInformationSchema = z
  .object({
    age: numberField(
      z
        .number({ error: 'Age must be 18 or older' })
        .int({ error: 'Age must be 18 or older' })
        .min(18, { error: 'Age must be 18 or older' }),
    ),
    employmentStatus: z.enum(
      ['employed', 'self_employed', 'unemployed', 'retired'],
      { error: 'Please select your employment status' },
    ),
    employmentDuration: z.preprocess(parseNumber, z.number().int().optional()),
  })
  .refine(
    function hasRequiredEmploymentDuration({
      employmentStatus,
      employmentDuration,
    }) {
      return (
        !requiresEmploymentDetails(employmentStatus) ||
        (employmentDuration !== undefined && employmentDuration >= 3)
      )
    },
    {
      path: ['employmentDuration'],
      error: 'Minimum 3 months employment required',
    },
  )

const applicantDetailsSchema = z
  .object({
    firstName: z.string().trim().min(1, 'Please enter your first name'),
    surname: z.string().trim().min(1, 'Please enter your surname'),
    companyName: z.string().optional(),
  })
  .and(personalInformationSchema)
  .refine(
    function hasRequiredCompanyName({ employmentStatus, companyName }) {
      return (
        !requiresEmploymentDetails(employmentStatus) ||
        Boolean(companyName?.trim())
      )
    },
    {
      path: ['companyName'],
      error: 'Please enter your company name',
    },
  )

const financialInformationSchema = z
  .object({
    monthlyIncome: numberField(
      z
        .number({ error: 'Minimum monthly income of R5,000 required' })
        .min(5000, {
          error: 'Minimum monthly income of R5,000 required',
        }),
    ),
    monthlyExpenses: numberField(
      z
        .number({ error: 'Monthly expenses cannot be negative' })
        .min(0, { error: 'Monthly expenses cannot be negative' }),
    ),
    existingDebt: numberField(
      z
        .number({ error: 'Existing monthly debt cannot be negative' })
        .min(0, { error: 'Existing monthly debt cannot be negative' }),
    ),
    creditScore: numberField(
      z
        .number({ error: 'Credit score must be between 300 and 850' })
        .int({ error: 'Credit score must be between 300 and 850' })
        .min(300, { error: 'Credit score must be between 300 and 850' })
        .max(850, { error: 'Credit score must be between 300 and 850' }),
    ),
  })
  .refine(
    function existingDebtDoesNotExceedExpenses({
      existingDebt,
      monthlyExpenses,
    }) {
      return existingDebt <= monthlyExpenses
    },
    {
      path: ['existingDebt'],
      error: 'Existing monthly debt cannot exceed monthly expenses',
    },
  )

const loanProductSchema = z.object({
  loanProduct: z.enum(['personal_loan', 'vehicle_loan'], {
    error: 'Please select a loan product',
  }),
})

function createLoanDetailsSchema(product: LoanProduct) {
  return z.object({
    requestedAmount: numberField(
      z
        .number({ error: 'Please enter a valid loan amount' })
        .min(product.minAmount, {
          error: `Loan amount must be at least R${product.minAmount.toLocaleString('en-ZA')}`,
        })
        .max(product.maxAmount, {
          error: `Loan amount cannot exceed R${product.maxAmount.toLocaleString('en-ZA')}`,
        }),
    ),
    loanTerm: numberField(
      z
        .number({ error: 'Please enter a valid loan term' })
        .int({ error: 'Please enter a valid loan term' })
        .min(product.minTerm, {
          error: `Loan term must be at least ${product.minTerm} months`,
        })
        .max(product.maxTerm, {
          error: `Loan term cannot exceed ${product.maxTerm} months`,
        }),
    ),
    loanPurpose: z
      .enum(
        [
          'home_improvement',
          'education',
          'medical',
          'other',
          'new_vehicle',
          'used_vehicle',
        ],
        { error: 'Please select a loan purpose' },
      )
      .refine(
        function purposeMatchesProduct(purpose) {
          return product.purposes.includes(purpose)
        },
        {
          error: `The selected purpose is not available for ${product.name}`,
        },
      ),
  })
}

function validateApplicantDetails(data: unknown) {
  return applicantDetailsSchema.safeParse(data)
}

function validateFinancialDetails(data: unknown) {
  return financialInformationSchema.safeParse(data)
}

function validateLoanDetails(data: unknown, product?: LoanProduct) {
  const productValidation = loanProductSchema.safeParse(data)

  if (!productValidation.success || !product) {
    return productValidation
  }

  return loanProductSchema.and(createLoanDetailsSchema(product)).safeParse(data)
}

function getFieldErrors(error: z.ZodError) {
  return error.issues.reduce<Record<string, string>>(
    function collectFieldErrors(errors, issue) {
      const field = issue.path.at(-1)

      if (field !== undefined && !errors[String(field)]) {
        errors[String(field)] = issue.message
      }

      return errors
    },
    {},
  )
}

function validateLoan(request: unknown, product: LoanProduct) {
  return z
    .object({
      personalInfo: personalInformationSchema,
      financialInfo: financialInformationSchema,
      loanDetails: createLoanDetailsSchema(product),
    })
    .safeParse(request)
}

export {
  getFieldErrors,
  requiresEmploymentDetails,
  validateApplicantDetails,
  validateFinancialDetails,
  validateLoan,
  validateLoanDetails,
}
