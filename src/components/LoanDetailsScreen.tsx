import * as React from 'react'
import { useMutation } from '@tanstack/react-query'

import { loanEligibilityMutationOptions } from '@/api/loanEligibility'
import { ApplicationScreen } from '@/components/ApplicationScreen'
import type { EligibilityFlowScreenProps } from '@/components/ApplicationScreen'
import { InputField } from '@/components/ui/InputField'
import { SelectField } from '@/components/ui/SelectField'
import { findLoanProduct, loanProducts } from '@/domain/products'
import { useLoanApplicationStore } from '@/stores/loanApplicationStore'
import type { LoanProductId, LoanPurpose } from '@/types/loan'
import { getFieldErrors, validateLoanDetails } from '@/utils/loanValidation'

const productOptions = loanProducts.map((product) => ({
  value: product.id,
  label: product.name,
}))

const purposeLabels: Record<LoanPurpose, string> = {
  home_improvement: 'Home improvement',
  education: 'Education',
  medical: 'Medical',
  other: 'Other',
  new_vehicle: 'New vehicle',
  used_vehicle: 'Used vehicle',
}

const LoanDetailsScreen = ({
  stepNumber,
  totalSteps,
  pageTitle,
  pageSubTitle,
  data,
  onBack,
  onContinue,
}: EligibilityFlowScreenProps) => {
  const [formData, setFormData] = React.useState(data)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const selectedProduct = findLoanProduct(formData.loanProduct as LoanProductId)
  const purposeOptions =
    selectedProduct?.purposes.map((purpose) => ({
      value: purpose,
      label: purposeLabels[purpose],
    })) ?? []
  const createLoanEligibilityRequest = useLoanApplicationStore(
    (state) => state.createLoanEligibilityRequest,
  )
  const saveCurrentStep = useLoanApplicationStore(
    (state) => state.saveCurrentStep,
  )
  const setEligibilityResult = useLoanApplicationStore(
    (state) => state.setEligibilityResult,
  )
  const eligibilityMutation = useMutation(loanEligibilityMutationOptions())

  const updateField = (field: string, value: string) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [field]: '' }))
  }

  const handleProductChange = (value: string) => {
    setFormData((currentData) => ({
      ...currentData,
      loanProduct: value,
      loanPurpose: '',
    }))
    setErrors((currentErrors) => ({
      ...currentErrors,
      loanProduct: '',
      loanPurpose: '',
    }))
  }

  const handleContinue = () => {
    const validation = validateLoanDetails(formData, selectedProduct)

    if (!validation.success) {
      setErrors(getFieldErrors(validation.error))
      return
    }

    setErrors({})
    saveCurrentStep(formData)

    eligibilityMutation.mutate(createLoanEligibilityRequest(), {
      onSuccess: (result) => {
        setEligibilityResult(result)
        onContinue(formData)
      },
    })
  }

  return (
    <ApplicationScreen
      currentStep={stepNumber}
      totalSteps={totalSteps}
      title={pageTitle}
      pageSubTitle={pageSubTitle}
      onBack={onBack}
      onContinue={handleContinue}
      continueLabel="Check eligibility"
      isSubmitting={eligibilityMutation.isPending}
    >
      <div className="grid gap-(--layout-field-gap) sm:grid-cols-2">
        <SelectField
          label="Loan product"
          name="loanProduct"
          placeholder="Select loan product"
          options={productOptions}
          value={formData.loanProduct}
          onValueChange={handleProductChange}
          error={errors.loanProduct}
        />
        <SelectField
          label="Loan purpose"
          name="loanPurpose"
          placeholder="Select loan purpose"
          options={purposeOptions}
          value={formData.loanPurpose}
          onValueChange={(value) => updateField('loanPurpose', value)}
          disabled={!selectedProduct}
          error={errors.loanPurpose}
        />
        <InputField
          label="Loan amount"
          name="requestedAmount"
          type="number"
          inputMode="decimal"
          placeholder="Enter loan amount"
          value={formData.requestedAmount}
          onChange={(event) =>
            updateField('requestedAmount', event.target.value)
          }
          error={errors.requestedAmount}
        />
        <InputField
          label="Loan term"
          name="loanTerm"
          type="number"
          inputMode="numeric"
          placeholder="Enter term in months"
          value={formData.loanTerm}
          onChange={(event) => updateField('loanTerm', event.target.value)}
          error={errors.loanTerm}
        />
      </div>
    </ApplicationScreen>
  )
}

export { LoanDetailsScreen }
