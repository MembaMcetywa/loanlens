import * as React from 'react'
import { useMutation } from '@tanstack/react-query'

import { loanEligibilityMutationOptions } from '@/api/loanEligibility'
import { ApplicationScreen } from '@/components/ApplicationScreen'
import type { EligibilityFlowScreenProps } from '@/components/ApplicationScreen'
import { InputField } from '@/components/ui/InputField'
import { SelectField } from '@/components/ui/SelectField'
import { findLoanProduct, loanProducts } from '@/domain/loans/products'
import { useLoanApplicationStore } from '@/stores/loanApplicationStore'
import type { LoanProductId, LoanPurpose } from '@/types/loan'

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
  }

  const handleProductChange = (value: string) => {
    setFormData((currentData) => ({
      ...currentData,
      loanProduct: value,
      loanPurpose: '',
    }))
  }

  const handleContinue = () => {
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
          required
        />
        <SelectField
          label="Loan purpose"
          name="loanPurpose"
          placeholder="Select loan purpose"
          options={purposeOptions}
          value={formData.loanPurpose}
          onValueChange={(value) => updateField('loanPurpose', value)}
          disabled={!selectedProduct}
          required
        />
        <InputField
          label="Loan amount"
          name="requestedAmount"
          type="number"
          min={5000}
          inputMode="decimal"
          placeholder="Enter loan amount"
          value={formData.requestedAmount}
          onChange={(event) =>
            updateField('requestedAmount', event.target.value)
          }
          required
        />
        <InputField
          label="Loan term"
          name="loanTerm"
          type="number"
          min={6}
          inputMode="numeric"
          placeholder="Enter term in months"
          value={formData.loanTerm}
          onChange={(event) => updateField('loanTerm', event.target.value)}
          required
        />
      </div>
    </ApplicationScreen>
  )
}

export { LoanDetailsScreen }
