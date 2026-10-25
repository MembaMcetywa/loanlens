import { mutationOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

import { calculateLoanEligibility } from '@/domain/eligibilityEngine'
import { findLoanProductByPurpose } from '@/domain/products'
import type { LoanEligibilityRequest } from '@/types/loan'
import { validateLoan } from '@/utils/loanValidation'

const responseDelay = 800

function delayEligibilityResponse() {
  return new Promise<void>(function waitForResponse(resolve) {
    setTimeout(resolve, responseDelay)
  })
}

function validateEligibilityRequest(request: LoanEligibilityRequest) {
  const product = findLoanProductByPurpose(request.loanDetails.loanPurpose)

  if (!product) {
    throw new Error('The selected loan purpose is not supported')
  }

  const validation = validateLoan(request, product)

  if (!validation.success) {
    throw validation.error
  }

  return { product, request: validation.data }
}

const checkLoanEligibility = createServerFn({ method: 'POST' })
  .validator(function validateRequestInput(request: LoanEligibilityRequest) {
    return request
  })
  .handler(async function handleEligibilityRequest({ data }) {
    const validatedRequest = validateEligibilityRequest(data)

    await delayEligibilityResponse()

    return calculateLoanEligibility(
      validatedRequest.request,
      validatedRequest.product,
    )
  })

async function requestLoanEligibility(request: LoanEligibilityRequest) {
  const validatedRequest = validateEligibilityRequest(request)

  return checkLoanEligibility({ data: validatedRequest.request })
}

function loanEligibilityMutationOptions() {
  return mutationOptions({ mutationFn: requestLoanEligibility })
}

export { loanEligibilityMutationOptions, requestLoanEligibility }
