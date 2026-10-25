import { z } from 'zod'

import type { LoanProduct } from '@/types/loan'

function validateLoan(request: unknown, product: LoanProduct) {
  const schema = z.object({
    personalInfo: z
      .object({
        age: z
          .number({ error: 'Age must be 18 or older' })
          .int({ error: 'Age must be 18 or older' })
          .min(18, { error: 'Age must be 18 or older' }),
        employmentStatus: z.enum(
          ['employed', 'self_employed', 'unemployed', 'retired'],
          { error: 'Please select your employment status' },
        ),
        employmentDuration: z.number().int().optional(),
      })
      .refine(
        ({ employmentStatus, employmentDuration }) =>
          !['employed', 'self_employed'].includes(employmentStatus) ||
          (employmentDuration !== undefined && employmentDuration >= 3),
        {
          path: ['employmentDuration'],
          error: 'Minimum 3 months employment required',
        },
      ),
    financialInfo: z
      .object({
        monthlyIncome: z
          .number({ error: 'Minimum monthly income of R5,000 required' })
          .min(5000, {
            error: 'Minimum monthly income of R5,000 required',
          }),
        monthlyExpenses: z
          .number({ error: 'Monthly expenses cannot be negative' })
          .min(0, { error: 'Monthly expenses cannot be negative' }),
        existingDebt: z
          .number({ error: 'Existing monthly debt cannot be negative' })
          .min(0, { error: 'Existing monthly debt cannot be negative' }),
        creditScore: z
          .number({ error: 'Credit score must be between 300 and 850' })
          .int({ error: 'Credit score must be between 300 and 850' })
          .min(300, { error: 'Credit score must be between 300 and 850' })
          .max(850, { error: 'Credit score must be between 300 and 850' }),
      })
      .refine(
        ({ existingDebt, monthlyExpenses }) => existingDebt <= monthlyExpenses,
        {
          path: ['existingDebt'],
          error: 'Existing monthly debt cannot exceed monthly expenses',
        },
      ),
    loanDetails: z.object({
      requestedAmount: z
        .number({ error: 'Please enter a valid loan amount' })
        .min(product.minAmount, {
          error: `Loan amount must be at least R${product.minAmount.toLocaleString('en-ZA')}`,
        })
        .max(product.maxAmount, {
          error: `Loan amount cannot exceed R${product.maxAmount.toLocaleString('en-ZA')}`,
        }),
      loanTerm: z
        .number({ error: 'Please enter a valid loan term' })
        .int({ error: 'Please enter a valid loan term' })
        .min(product.minTerm, {
          error: `Loan term must be at least ${product.minTerm} months`,
        })
        .max(product.maxTerm, {
          error: `Loan term cannot exceed ${product.maxTerm} months`,
        }),
      loanPurpose: z
        .enum([
          'home_improvement',
          'education',
          'medical',
          'other',
          'new_vehicle',
          'used_vehicle',
        ])
        .refine((purpose) => product.purposes.includes(purpose), {
          error: `The selected purpose is not available for ${product.name}`,
        }),
    }),
  })

  return schema.safeParse(request)
}

export { validateLoan }
