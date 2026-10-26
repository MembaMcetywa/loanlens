import * as React from 'react'

import { ApplicationScreen } from '@/components/ApplicationScreen'
import type { EligibilityFlowScreenProps } from '@/components/ApplicationScreen'
import { InputField } from '@/components/ui/InputField'
import {
  getFieldErrors,
  validateFinancialDetails,
} from '@/utils/loanValidation'

const FinancialDetailsScreen = ({
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

  const updateField = (field: string, value: string) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [field]: '' }))
  }

  const handleContinue = () => {
    const validation = validateFinancialDetails(formData)

    if (!validation.success) {
      setErrors(getFieldErrors(validation.error))
      return
    }

    setErrors({})
    onContinue(formData)
  }

  return (
    <ApplicationScreen
      currentStep={stepNumber}
      totalSteps={totalSteps}
      title={pageTitle}
      pageSubTitle={pageSubTitle}
      onBack={onBack}
      onContinue={handleContinue}
    >
      <div className="grid gap-(--layout-field-gap) sm:grid-cols-2">
        <InputField
          label="Monthly income"
          name="monthlyIncome"
          type="number"
          inputMode="decimal"
          placeholder="Enter monthly income"
          value={formData.monthlyIncome}
          onChange={(event) => updateField('monthlyIncome', event.target.value)}
          error={errors.monthlyIncome}
        />
        <InputField
          label="Monthly expenses"
          name="monthlyExpenses"
          type="number"
          inputMode="decimal"
          placeholder="Enter monthly expenses"
          value={formData.monthlyExpenses}
          onChange={(event) =>
            updateField('monthlyExpenses', event.target.value)
          }
          error={errors.monthlyExpenses}
        />
        <InputField
          label="Existing monthly debt"
          name="existingDebt"
          type="number"
          inputMode="decimal"
          placeholder="Enter existing debt repayments"
          value={formData.existingDebt}
          onChange={(event) => updateField('existingDebt', event.target.value)}
          error={errors.existingDebt}
        />
        <InputField
          label="Credit score"
          name="creditScore"
          type="number"
          inputMode="numeric"
          placeholder="Enter credit score"
          value={formData.creditScore}
          onChange={(event) => updateField('creditScore', event.target.value)}
          error={errors.creditScore}
        />
      </div>
    </ApplicationScreen>
  )
}

export { FinancialDetailsScreen }
