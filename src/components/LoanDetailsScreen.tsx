import * as React from 'react'

import { ApplicationScreen } from '@/components/ApplicationScreen'
import type { EligibilityFlowScreenProps } from '@/components/ApplicationScreen'
import { InputField } from '@/components/ui/InputField'
import { SelectField } from '@/components/ui/SelectField'

const productOptions = [
  { value: 'personal_loan', label: 'Personal Loan' },
  { value: 'vehicle_loan', label: 'Vehicle Finance' },
] as const

const purposeOptions = [
  { value: 'home_improvement', label: 'Home improvement' },
  { value: 'education', label: 'Education' },
  { value: 'medical', label: 'Medical' },
  { value: 'new_vehicle', label: 'New vehicle' },
  { value: 'used_vehicle', label: 'Used vehicle' },
  { value: 'other', label: 'Other' },
] as const

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

  const updateField = (field: string, value: string) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }))
  }

  const handleContinue = () => onContinue(formData)

  return (
    <ApplicationScreen
      currentStep={stepNumber}
      totalSteps={totalSteps}
      title={pageTitle}
      pageSubTitle={pageSubTitle}
      onBack={onBack}
      onContinue={handleContinue}
      continueLabel="Check eligibility"
    >
      <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
        <SelectField
          label="Loan product"
          name="loanProduct"
          placeholder="Select loan product"
          options={productOptions}
          value={formData.loanProduct}
          onValueChange={(value) => updateField('loanProduct', value)}
          required
        />
        <SelectField
          label="Loan purpose"
          name="loanPurpose"
          placeholder="Select loan purpose"
          options={purposeOptions}
          value={formData.loanPurpose}
          onValueChange={(value) => updateField('loanPurpose', value)}
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
