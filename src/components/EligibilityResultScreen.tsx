import loanLensLogo from '@/assets/loanlens-logo.svg'
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

const EligibilityResultScreen = ({
  pageTitle,
  pageSubTitle,
  onBack,
}: EligibilityFlowScreenProps) => {
  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <img src={loanLensLogo} alt="LoanLens" className="h-8 w-auto sm:h-9" />

        <section className="mx-auto mt-12 w-full max-w-3xl sm:mt-16">
          <header className="mx-auto max-w-2xl text-center">
            <Badge variant="eligible">Eligible</Badge>
            <h1 className="mt-5 font-heading text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl">
              {pageTitle}
            </h1>
            {pageSubTitle ? (
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {pageSubTitle}
              </p>
            ) : null}
          </header>

          <Card variant="accent" className="mt-10 sm:mt-12">
            <CardHeader>
              <CardTitle>Loan estimate</CardTitle>
              <CardDescription>
                The estimate uses the details supplied in the eligibility check.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-7 sm:grid-cols-2">
                <MetricItem label="Loan amount" value="R150,000.00" />
                <MetricItem label="Monthly payment" value="R7,096.10" />
                <MetricItem label="Interest rate" value="12.5%" />
                <MetricItem label="Loan term" value="24 months" />
                <MetricItem label="Total repayment" value="R170,306.40" />
                <MetricItem label="Approval likelihood" value="85%" />
              </dl>
            </CardContent>
            <CardFooter className="mt-2 grid gap-4 sm:flex sm:flex-row-reverse sm:justify-start">
              <Button type="button" className="w-full sm:w-auto">
                Apply now
              </Button>
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
  )
}

export { EligibilityResultScreen }
