import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import loanLensLogo from '@/assets/loanlens-logo.svg'
import neuralNetwork from '@/assets/neural-network.svg'
import { Button } from '@/components/ui/button'
import { useLoanApplicationStore } from '@/stores/loanApplicationStore'

const Home = () => {
  const navigate = useNavigate()
  const resetApplication = useLoanApplicationStore(
    (state) => state.resetApplication,
  )

  const handleStartApplication = () => {
    resetApplication()
    void navigate({ to: '/application' })
  }

  return (
    <main className="m-0 min-h-screen w-full max-w-none overflow-hidden px-(--layout-page-inline) py-(--layout-page-block)">
      <div className="mx-auto grid min-h-[calc(100vh-(var(--layout-page-block)*2))] w-full max-w-7xl grid-rows-[auto_1fr]">
        <img src={loanLensLogo} alt="LoanLens" className="h-8 w-auto sm:h-9" />

        <section className="grid items-center gap-(--layout-section-gap) py-(--layout-section-gap) lg:grid-cols-[minmax(0,1fr)_minmax(26rem,0.95fr)]">
          <div className="flex max-w-2xl flex-col items-start">
            <h1 className="font-heading text-5xl leading-[1.02] font-semibold tracking-[-0.045em] text-foreground sm:text-6xl lg:text-[4.5rem] xl:text-[5rem]">
              <span className="block">See what you</span>
              <span className="block text-primary">could qualify for</span>
            </h1>
            <p className="mt-(--layout-content-gap) max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Use our advanced loan eligibility estimator to see what you could
              qualify for.
            </p>
            <Button
              type="button"
              size="xl"
              className="mt-(--layout-content-gap) w-full justify-center sm:w-auto sm:min-w-72"
              onClick={handleStartApplication}
            >
              Check my eligibility
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Button>
          </div>

          <img
            src={neuralNetwork}
            alt=""
            className="mx-auto hidden w-full max-w-2xl lg:block lg:max-w-none"
            aria-hidden="true"
          />
        </section>
      </div>
    </main>
  )
}

export const Route = createFileRoute('/')({ component: Home })
