import * as React from 'react'

import { AnimatedNameHeading } from '@/components/AnimatedNameHeading'
import { ApplicationScreen } from '@/components/ApplicationScreen'
import type { EligibilityFlowScreenProps } from '@/components/ApplicationScreen'
import { InputField } from '@/components/ui/InputField'
import { SelectField } from '@/components/ui/SelectField'

const employmentOptions = [
  { value: 'employed', label: 'Employed' },
  { value: 'self_employed', label: 'Self-employed' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'retired', label: 'Retired' },
] as const

const ApplicantDetailsScreen = ({
  stepNumber,
  totalSteps,
  pageTitle,
  pageSubTitle,
  data,
  onBack,
  onContinue,
}: EligibilityFlowScreenProps) => {
  const [formData, setFormData] = React.useState(data)
  const [isNameTyping, setIsNameTyping] = React.useState(false)
  const firstName = formData.firstName
  const employmentStatus = formData.employmentStatus
  const employmentDetailsEnabled = ['employed', 'self_employed'].includes(
    employmentStatus,
  )

  const updateField = (field: string, value: string) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }))
  }

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsNameTyping(true)
    updateField('firstName', event.target.value)
  }

  const handleContinue = () => onContinue(formData)

  return (
    <ApplicationScreen
      currentStep={stepNumber}
      totalSteps={totalSteps}
      title={
        firstName ? (
          <AnimatedNameHeading firstName={firstName} isTyping={isNameTyping} />
        ) : (
          pageTitle
        )
      }
      pageSubTitle={pageSubTitle}
      onBack={onBack}
      onContinue={handleContinue}
    >
      <div className="grid gap-(--layout-field-gap) sm:grid-cols-2">
        <InputField
          label="First name"
          name="firstName"
          autoComplete="given-name"
          placeholder="Enter first name"
          value={firstName}
          onChange={handleFirstNameChange}
          onBlur={() => setIsNameTyping(false)}
          required
        />
        <InputField
          label="Surname"
          name="surname"
          autoComplete="family-name"
          placeholder="Enter surname"
          value={formData.surname}
          onChange={(event) => updateField('surname', event.target.value)}
          required
        />
        <InputField
          label="Age"
          name="age"
          type="number"
          min={18}
          inputMode="numeric"
          placeholder="Enter age"
          value={formData.age}
          onChange={(event) => updateField('age', event.target.value)}
          required
        />
        <SelectField
          label="Employment status"
          name="employmentStatus"
          placeholder="Select employment status"
          options={employmentOptions}
          value={employmentStatus}
          onValueChange={(value) => updateField('employmentStatus', value)}
          required
        />
        <InputField
          label="Company name"
          name="companyName"
          autoComplete="organization"
          placeholder="Enter company name"
          value={formData.companyName}
          onChange={(event) => updateField('companyName', event.target.value)}
          disabled={!employmentDetailsEnabled}
        />
        <InputField
          label="Employment duration (in months)"
          name="employmentDuration"
          type="number"
          min={3}
          inputMode="numeric"
          placeholder="Enter months employed"
          value={formData.employmentDuration}
          onChange={(event) =>
            updateField('employmentDuration', event.target.value)
          }
          disabled={!employmentDetailsEnabled}
          required={employmentDetailsEnabled}
        />
      </div>
    </ApplicationScreen>
  )
}

export { ApplicantDetailsScreen }
