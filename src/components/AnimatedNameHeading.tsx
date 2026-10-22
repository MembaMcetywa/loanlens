import * as React from 'react'
import { cn } from 'cn'

type AnimatedNameHeadingProps = {
  firstName: string
  isTyping: boolean
  className?: string
}

const AnimatedNameHeading = ({
  firstName,
  isTyping,
  className,
}: AnimatedNameHeadingProps) => {
  const previousFirstName = React.useRef(firstName)
  const animationStartIndex =
    isTyping && firstName.length > previousFirstName.current.length
      ? previousFirstName.current.length
      : Number.POSITIVE_INFINITY
  const heading = firstName
    ? `${firstName}, tell us about yourself`
    : 'Tell us about yourself'

  React.useEffect(() => {
    previousFirstName.current = firstName
  }, [firstName])

  if (!firstName) {
    return <span className={className}>{heading}</span>
  }

  return (
    <span className={className} aria-label={heading}>
      <span aria-hidden="true">
        {Array.from(firstName).map((character, index) => (
          <span
            key={index}
            className={cn(
              'inline-block',
              index >= animationStartIndex && 'animate-name-character',
            )}
          >
            {character === ' ' ? '\u00a0' : character}
          </span>
        ))}
        <span>, tell us about yourself</span>
      </span>
    </span>
  )
}

export { AnimatedNameHeading }
export type { AnimatedNameHeadingProps }
