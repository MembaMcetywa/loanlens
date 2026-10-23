import * as React from 'react'

import { ApplicationScreen } from '@/components/ApplicationScreen'
import type { EligibilityFlowScreenProps } from '@/components/ApplicationScreen'
import { InputField } from '@/components/ui/InputField'

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
    >
      <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
        <InputField
          label="Monthly income"
          name="monthlyIncome"
          type="number"
          min={5000}
          inputMode="decimal"
          placeholder="Enter monthly income"
          value={formData.monthlyIncome}
          onChange={(event) => updateField('monthlyIncome', event.target.value)}
          required
        />
        <InputField
          label="Monthly expenses"
          name="monthlyExpenses"
          type="number"
          min={0}
          inputMode="decimal"
          placeholder="Enter monthly expenses"
          value={formData.monthlyExpenses}
          onChange={(event) =>
            updateField('monthlyExpenses', event.target.value)
          }
          required
        />
        <InputField
          label="Existing monthly debt"
          name="existingDebt"
          type="number"
          min={0}
          inputMode="decimal"
          placeholder="Enter existing debt repayments"
          value={formData.existingDebt}
          onChange={(event) => updateField('existingDebt', event.target.value)}
          required
        />
        <InputField
          label="Credit score"
          name="creditScore"
          type="number"
          min={300}
          max={850}
          inputMode="numeric"
          placeholder="Enter credit score"
          value={formData.creditScore}
          onChange={(event) => updateField('creditScore', event.target.value)}
          required
        />
      </div>
    </ApplicationScreen>
  )
}

export { FinancialDetailsScreen }
