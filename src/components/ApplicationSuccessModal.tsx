import * as React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import type { DotLottie } from '@lottiefiles/dotlottie-react'

type ApplicationSuccessModalProps = {
  firstName: string
  isOpen: boolean
  onComplete: () => void
}

const ApplicationSuccessModal = ({
  firstName,
  isOpen,
  onComplete,
}: ApplicationSuccessModalProps) => {
  const [dotLottie, setDotLottie] = React.useState<DotLottie | null>(null)
  const message = firstName
    ? `${firstName}, your loan application has been received, we will be in touch.`
    : 'Your loan application has been received, we will be in touch.'

  React.useEffect(() => {
    if (!isOpen) {
      return
    }

    if (!dotLottie) {
      return
    }

    const finishAnimation = () => onComplete()
    const playAnimation = () => {
      dotLottie.setFrame(0)
      dotLottie.play()
    }

    dotLottie.addEventListener('complete', finishAnimation)
    dotLottie.addEventListener('loadError', finishAnimation)

    if (dotLottie.isLoaded) {
      playAnimation()
    } else {
      dotLottie.addEventListener('load', playAnimation)
    }

    return () => {
      dotLottie.removeEventListener('complete', finishAnimation)
      dotLottie.removeEventListener('loadError', finishAnimation)
      dotLottie.removeEventListener('load', playAnimation)
    }
  }, [dotLottie, isOpen, onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 px-(--layout-page-inline) backdrop-blur-sm transition-opacity duration-150 ${isOpen ? 'opacity-100' : 'pointer-events-none invisible opacity-0'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="application-success-title"
      aria-describedby="application-success-message"
      aria-hidden={!isOpen}
    >
      <div className="w-full max-w-md rounded-xl border border-primary/20 bg-card p-(--layout-card-gap) text-center shadow-xl">
        <h2
          id="application-success-title"
          className="font-heading text-3xl font-semibold tracking-tight text-foreground"
        >
          All done
        </h2>
        <p
          id="application-success-message"
          className="mt-2 text-base leading-7 text-muted-foreground"
        >
          {message}
        </p>

        <DotLottieReact
          src="/success.lottie"
          autoplay={false}
          loop={false}
          dotLottieRefCallback={setDotLottie}
          className="mx-auto mt-4 h-48 w-full sm:h-56"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

export { ApplicationSuccessModal }
export type { ApplicationSuccessModalProps }
