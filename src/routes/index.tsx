import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon } from 'lucide-react'

import { AnimatedNameHeading } from '@/components/AnimatedNameHeading'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { InputField } from '@/components/ui/InputField'
import { MetricItem } from '@/components/ui/MetricItem'
import { SelectField } from '@/components/ui/SelectField'
import { Stepper } from '@/components/ui/Stepper'

const employmentOptions = [
  { value: 'employed', label: 'Employed' },
  { value: 'self-employed', label: 'Self-employed' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'retired', label: 'Retired' },
] as const

const loanPurposeOptions = [
  { value: 'personal', label: 'Personal' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'education', label: 'Education' },
  { value: 'home-improvement', label: 'Home improvement' },
] as const

const Home = () => {
  const [firstName, setFirstName] = React.useState('')
  const [isNameTyping, setIsNameTyping] = React.useState(false)
  const [currentStep, setCurrentStep] = React.useState(1)

  const updateFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsNameTyping(true)
    setFirstName(event.target.value)
  }

  return (
    <main className="min-h-screen px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-16">
        <header className="mx-auto grid max-w-2xl gap-4 text-center">
          <Badge variant="eligible" className="mx-auto">
            LoanLens design system
          </Badge>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            Component preview
          </h1>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg">
            Review the visual states and interactions before they are composed
            into the application screens.
          </p>
        </header>

        <section className="grid gap-8" aria-labelledby="mobile-heading">
          <div className="grid gap-2 text-center">
            <h2 id="mobile-heading" className="text-2xl font-semibold">
              Mobile components
            </h2>
            <p className="text-muted-foreground">
              The preview is constrained to a 390px mobile content width.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[390px] overflow-hidden rounded-4xl border border-border bg-background shadow-sm">
            <div className="grid gap-12 px-5 py-8">
              <div className="grid gap-8">
                <Stepper currentStep={currentStep} totalSteps={3} />
                <div className="grid gap-2 text-center">
                  <h3 className="text-2xl leading-tight font-semibold">
                    <AnimatedNameHeading
                      firstName={firstName}
                      isTyping={isNameTyping}
                    />
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Enter your details to continue.
                  </p>
                </div>

                <div className="grid gap-6">
                  <InputField
                    label="First name"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={updateFirstName}
                    onBlur={() => setIsNameTyping(false)}
                  />
                  <InputField label="Surname" placeholder="Enter surname" />
                  <SelectField
                    label="Employment status"
                    placeholder="Select employment status"
                    options={employmentOptions}
                  />
                  <InputField
                    label="Company name"
                    placeholder="Enter company name"
                    disabled
                  />
                  <InputField
                    label="Monthly income"
                    type="number"
                    placeholder="Enter monthly income"
                    error="Enter an income of at least R5,000."
                  />
                </div>

                <div className="mt-2 grid gap-4">
                  <Button
                    size="xl"
                    className="w-full"
                    disabled={currentStep === 3}
                    onClick={() =>
                      setCurrentStep((step) => Math.min(3, step + 1))
                    }
                  >
                    Continue
                  </Button>
                  <Button
                    size="xl"
                    className="w-full"
                    variant="outline"
                    disabled={currentStep === 1}
                    onClick={() =>
                      setCurrentStep((step) => Math.max(1, step - 1))
                    }
                  >
                    Back
                  </Button>
                  <Button
                    size="xl"
                    className="w-full"
                    loading
                    aria-label="Checking eligibility"
                  >
                    Checking eligibility
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Mobile feedback</h3>
                <Alert>
                  <InfoIcon />
                  <AlertTitle>Estimate only</AlertTitle>
                  <AlertDescription>
                    Eligibility results do not represent a formal loan offer.
                  </AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <TriangleAlertIcon />
                  <AlertTitle>Unable to calculate eligibility</AlertTitle>
                  <AlertDescription>
                    Review the entered information and try again.
                  </AlertDescription>
                </Alert>
              </div>

              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Mobile result</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="eligible">Eligible</Badge>
                  <Badge variant="alternative">Alternative amount</Badge>
                  <Badge variant="ineligible">Not eligible</Badge>
                </div>
                <Card variant="accent" size="sm">
                  <CardHeader>
                    <Badge variant="eligible">Eligible</Badge>
                    <CardTitle>Estimated loan result</CardTitle>
                    <CardDescription>
                      The requested amount is within the estimated limit.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-2 gap-5">
                      <MetricItem label="Loan amount" value="R150,000" />
                      <MetricItem label="Monthly repayment" value="R4,128" />
                      <MetricItem label="Interest rate" value="18.5%" />
                      <MetricItem label="Loan term" value="48 months" />
                    </dl>
                  </CardContent>
                  <CardFooter>
                    <Button size="xl" className="w-full">
                      Apply now
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8" aria-labelledby="progress-heading">
          <div className="grid gap-2 text-center">
            <h2 id="progress-heading" className="text-2xl font-semibold">
              Progress
            </h2>
            <p className="text-muted-foreground">
              The stepper remains independent from the page heading.
            </p>
          </div>
          <Stepper currentStep={currentStep} totalSteps={3} />
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((step) => Math.max(1, step - 1))}
            >
              Previous step
            </Button>
            <Button
              disabled={currentStep === 3}
              onClick={() => setCurrentStep((step) => Math.min(3, step + 1))}
            >
              Next step
            </Button>
          </div>
        </section>

        <section className="grid gap-8" aria-labelledby="fields-heading">
          <div className="grid gap-2 text-center">
            <h2 id="fields-heading" className="text-2xl font-semibold">
              Form fields
            </h2>
            <p className="text-muted-foreground">
              Default, validation, and disabled field states.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                <AnimatedNameHeading
                  firstName={firstName}
                  isTyping={isNameTyping}
                />
              </CardTitle>
              <CardDescription>
                The heading responds only while the given name changes.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <InputField
                label="First name"
                placeholder="Enter first name"
                value={firstName}
                onChange={updateFirstName}
                onBlur={() => setIsNameTyping(false)}
              />
              <InputField label="Surname" placeholder="Enter surname" />
              <InputField
                label="Monthly income"
                type="number"
                placeholder="Enter monthly income"
                error="Enter an income of at least R5,000."
              />
              <SelectField
                label="Employment status"
                placeholder="Select employment status"
                options={employmentOptions}
              />
              <InputField
                label="Company name"
                placeholder="Enter company name"
                disabled
              />
              <SelectField
                label="Loan purpose"
                placeholder="Select loan purpose"
                options={loanPurposeOptions}
                error="Select a loan purpose."
              />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-8" aria-labelledby="actions-heading">
          <div className="grid gap-2 text-center">
            <h2 id="actions-heading" className="text-2xl font-semibold">
              Actions and loading
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button>Continue</Button>
            <Button variant="outline">Back</Button>
            <Button variant="secondary">Start again</Button>
            <Button variant="destructive">Cancel</Button>
            <Button loading aria-label="Checking eligibility">
              Checking eligibility
            </Button>
            <Button size="xl">Apply now</Button>
          </div>
        </section>

        <section className="grid gap-8" aria-labelledby="feedback-heading">
          <div className="grid gap-2 text-center">
            <h2 id="feedback-heading" className="text-2xl font-semibold">
              Feedback
            </h2>
          </div>
          <div className="grid gap-4">
            <Alert>
              <InfoIcon />
              <AlertTitle>Estimate only</AlertTitle>
              <AlertDescription>
                Eligibility results do not represent a formal loan offer.
              </AlertDescription>
            </Alert>
            <Alert variant="success">
              <CircleCheckIcon />
              <AlertTitle>Details saved</AlertTitle>
              <AlertDescription>
                Your confirmed information is ready for the next step.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <TriangleAlertIcon />
              <AlertTitle>Unable to calculate eligibility</AlertTitle>
              <AlertDescription>
                Review the entered information and try again.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        <section className="grid gap-8" aria-labelledby="results-heading">
          <div className="grid gap-2 text-center">
            <h2 id="results-heading" className="text-2xl font-semibold">
              Result presentation
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            <Card variant="accent">
              <CardHeader>
                <Badge variant="eligible">Eligible</Badge>
                <CardTitle>Estimated loan result</CardTitle>
                <CardDescription>
                  The requested amount is within the estimated limit.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-5">
                  <MetricItem label="Loan amount" value="R150,000" />
                  <MetricItem label="Monthly repayment" value="R4,128" />
                  <MetricItem label="Interest rate" value="18.5%" />
                  <MetricItem label="Loan term" value="48 months" />
                </dl>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Apply now</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <Badge variant="alternative">Alternative amount</Badge>
                <CardTitle>Estimated loan result</CardTitle>
                <CardDescription>
                  You may qualify for a lower loan amount.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-5">
                  <MetricItem label="Requested amount" value="R150,000" />
                  <MetricItem label="Estimated amount" value="R100,000" />
                  <MetricItem label="Monthly repayment" value="R2,752" />
                  <MetricItem label="Loan term" value="48 months" />
                </dl>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Apply now</Button>
              </CardFooter>
            </Card>

            <Card variant="destructive">
              <CardHeader>
                <Badge variant="ineligible">Not eligible</Badge>
                <CardTitle>Estimated loan result</CardTitle>
                <CardDescription>
                  The application does not meet the current eligibility policy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-5">
                  <MetricItem label="Requested amount" value="R150,000" />
                  <MetricItem label="Estimated amount" value="R0" />
                </dl>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Review details
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}

export const Route = createFileRoute('/')({ component: Home })
