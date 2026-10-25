import * as React from 'react'
import { createPortal } from 'react-dom'
import { CircleQuestionMarkIcon } from 'lucide-react'
import { Popover } from 'radix-ui'

import { Button } from './button'

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left'

type TooltipProps = {
  position: TooltipPosition
  title: string
  body: string
}

const largeScreenQuery = '(min-width: 64rem)'

const subscribeToLargeScreen = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(largeScreenQuery)

  mediaQuery.addEventListener('change', onChange)
  return () => mediaQuery.removeEventListener('change', onChange)
}

const getLargeScreenSnapshot = () => window.matchMedia(largeScreenQuery).matches

const getServerLargeScreenSnapshot = () => false

const Tooltip = ({ position, title, body }: TooltipProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const isLargeScreen = React.useSyncExternalStore(
    subscribeToLargeScreen,
    getLargeScreenSnapshot,
    getServerLargeScreenSnapshot,
  )
  const contentId = React.useId()
  const titleId = `${contentId}-title`
  const bodyId = `${contentId}-body`

  React.useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }

      event.stopPropagation()
      setIsOpen(false)
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()

    if (event.target === event.currentTarget) {
      setIsOpen(false)
    }
  }

  const handleContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const content = (
    <>
      <p id={titleId} className="font-semibold text-current">
        {title}
      </p>
      <p id={bodyId} className="mt-1 text-sm leading-6 text-current/80">
        {body}
      </p>
    </>
  )

  const overlay =
    isOpen && typeof document !== 'undefined'
      ? createPortal(
          <div
            data-slot="tooltip-overlay"
            className="fixed inset-0 h-dvh bg-black/30 z-(--layer-tooltip-overlay)"
            aria-hidden="true"
            onClick={handleOverlayClick}
          />,
          document.body,
        )
      : null

  const mobileContent =
    isOpen && !isLargeScreen && typeof document !== 'undefined'
      ? createPortal(
          <div
            id={contentId}
            data-slot="tooltip-content"
            role="tooltip"
            aria-labelledby={titleId}
            aria-describedby={bodyId}
            className="animate-mobile-tooltip-enter fixed inset-x-[var(--layout-page-inline)] bottom-[max(var(--layout-page-block),env(safe-area-inset-bottom))] max-h-[calc(100dvh_-_(var(--layout-page-block)_*_2))] overflow-y-auto rounded-xl border border-border bg-background p-5 text-foreground shadow-xl [z-index:var(--layer-tooltip)]"
            onClick={handleContentClick}
          >
            {content}
            <Button
              type="button"
              size="lg"
              className="mt-5 w-full"
              onClick={handleClose}
            >
              Understood
            </Button>
          </div>,
          document.body,
        )
      : null

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <Popover.Trigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-full text-muted-foreground hover:text-foreground"
          aria-haspopup={undefined}
          aria-label={`More information about ${title}`}
          aria-describedby={isOpen ? contentId : undefined}
        >
          <CircleQuestionMarkIcon className="size-4" aria-hidden="true" />
        </Button>
      </Popover.Trigger>

      {overlay}
      {mobileContent}

      {isLargeScreen ? (
        <Popover.Portal>
          <Popover.Content
            id={contentId}
            data-slot="tooltip-content"
            role="tooltip"
            aria-labelledby={titleId}
            aria-describedby={bodyId}
            side={position}
            align="center"
            sideOffset={8}
            collisionPadding={16}
            avoidCollisions
            className="w-72 rounded-lg border border-border bg-background px-4 py-3 text-foreground shadow-lg [z-index:var(--layer-tooltip)]"
            onClick={handleContentClick}
            onOpenAutoFocus={(event) => event.preventDefault()}
            onCloseAutoFocus={(event) => event.preventDefault()}
            onPointerDownOutside={(event) => event.preventDefault()}
            onInteractOutside={(event) => event.preventDefault()}
          >
            {content}
            <div className="mt-4 flex justify-end">
              <Button type="button" onClick={handleClose}>
                Understood
              </Button>
            </div>
            <Popover.Arrow className="fill-background stroke-border" />
          </Popover.Content>
        </Popover.Portal>
      ) : null}
    </Popover.Root>
  )
}

export { Tooltip }
export type { TooltipPosition, TooltipProps }
