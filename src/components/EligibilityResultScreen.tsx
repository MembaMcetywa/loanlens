import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'

import loanLensLogo from '@/assets/loanlens-logo.svg'
import { ApplicationSuccessModal } from '@/components/ApplicationSuccessModal'
import type { EligibilityFlowScreenProps } from '@/components/ApplicationScreen'
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
import { MetricItem } from '@/components/ui/MetricItem'
import { useLoanApplicationStore } from '@/stores/loanApplicationStore'

const currencyFormatter = new Intl.NumberFormat('en-ZA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const percentageFormatter = new Intl.NumberFormat('en-ZA', {
  maximumFractionDigits: 2,
})

const EligibilityResultScreen = ({
  pageTitle,
  pageSubTitle,
  onBack,
}: EligibilityFlowScreenProps) => {
  const [showSuccessModal, setShowSuccessModal] = React.useState(false)
  const navigate = useNavigate()
  const eligibilityResponse = useLoanApplicationStore(
    (state) => state.eligibilityResult,
  )
  const firstName = useLoanApplicationStore(
    (state) => state.eligibilityFlow[0].data.firstName,
  )
  const loanTerm = useLoanApplicationStore(
    (state) => state.eligibilityFlow[2].data.loanTerm,
  )
  const resetApplication = useLoanApplicationStore(
    (state) => state.resetApplication,
  )
  const handleAnimationComplete = React.useCallback(() => {
    void navigate({ to: '/' }).then(resetApplication)
  }, [navigate, resetApplication])

  const handleDone = () => {
    void navigate({ to: '/' }).then(resetApplication)
  }

  if (!eligibilityResponse) {
    return null
  }

  const { eligibilityResult, recommendedLoan } = eligibilityResponse
  const hasRecommendation = recommendedLoan.recommendedAmount > 0
  const badgeVariant = eligibilityResult.isEligible
    ? 'eligible'
    : hasRecommendation
      ? 'alternative'
      : 'ineligible'
  const badgeLabel = eligibilityResult.isEligible
    ? 'Eligible'
    : hasRecommendation
      ? 'Alternative available'
      : 'Not eligible'
  const handleApply = () => setShowSuccessModal(true)

  return (
    <>
      <main className="min-h-screen px-5 py-8 sm:px-8 lg:h-dvh lg:min-h-0 lg:overflow-hidden lg:px-12 lg:py-6">
        <div className="mx-auto w-full max-w-5xl lg:flex lg:h-full lg:flex-col">
          <img
            src={loanLensLogo}
            alt="LoanLens"
            className="h-8 w-auto self-start sm:h-9 cursor-pointer"
            onClick={handleDone}
          />

          <section className="mx-auto mt-12 w-full max-w-3xl sm:mt-16 lg:my-auto">
            <header className="mx-auto max-w-2xl text-center">
              <Badge variant={badgeVariant}>{badgeLabel}</Badge>
              <h1 className="mt-5 font-heading text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl lg:mt-3">
                {pageTitle}
              </h1>
              {pageSubTitle ? (
                <p className="mt-3 text-base leading-7 text-muted-foreground">
                  {pageSubTitle}
                </p>
              ) : null}
            </header>

            <Card
              variant={hasRecommendation ? 'accent' : 'destructive'}
              className="mt-10 sm:mt-12 lg:mt-5 lg:[--card-spacing:--spacing(4)]"
            >
              <CardHeader>
                <CardTitle>Loan estimate</CardTitle>
                <CardDescription>
                  {eligibilityResult.decisionReason}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-7 sm:grid-cols-2 lg:gap-x-7 lg:gap-y-4">
                  <MetricItem
                    label="Loan amount"
                    value={`R${currencyFormatter.format(recommendedLoan.recommendedAmount)}`}
                  />
                  <MetricItem
                    label="Monthly payment"
                    value={
                      recommendedLoan.monthlyPayment === undefined
                        ? '—'
                        : `R${currencyFormatter.format(recommendedLoan.monthlyPayment)}`
                    }
                  />
                  <MetricItem
                    label="Interest rate"
                    value={
                      recommendedLoan.interestRate === undefined
                        ? '—'
                        : `${percentageFormatter.format(recommendedLoan.interestRate)}%`
                    }
                  />
                  <MetricItem label="Loan term" value={`${loanTerm} months`} />
                  <MetricItem
                    label="Total repayment"
                    value={
                      recommendedLoan.totalRepayment === undefined
                        ? '—'
                        : `R${currencyFormatter.format(recommendedLoan.totalRepayment)}`
                    }
                  />
                  <MetricItem
                    label="Approval likelihood"
                    value={`${percentageFormatter.format(eligibilityResult.approvalLikelihood)}%`}
                  />
                </dl>
              </CardContent>
              <CardFooter className="mt-2 grid gap-4 sm:flex sm:flex-row-reverse sm:justify-start lg:mt-0">
                {hasRecommendation ? (
                  <Button
                    type="button"
                    className="w-full sm:w-auto"
                    onClick={handleApply}
                  >
                    Apply now
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="w-full sm:w-auto"
                    onClick={handleDone}
                  >
                    Done
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={onBack}
                >
                  Back
                </Button>
              </CardFooter>
            </Card>
          </section>
        </div>
      </main>

      <ApplicationSuccessModal
        firstName={firstName}
        isOpen={showSuccessModal}
        onComplete={handleAnimationComplete}
      />
    </>
  )
}

export { EligibilityResultScreen }
