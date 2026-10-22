import type { QueryClient } from '@tanstack/react-query'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'

type RouterContext = { queryClient: QueryClient }

const applicationDescription =
  'Estimate your loan eligibility using your income, expenses, and loan details.'

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'LoanLens' },
      { name: 'description', content: applicationDescription },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'LoanLens' },
      { property: 'og:title', content: 'LoanLens' },
      { property: 'og:description', content: applicationDescription },
      { property: 'og:image', content: '/social-preview.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      {
        property: 'og:image:alt',
        content: 'LoanLens loan eligibility estimator',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'LoanLens' },
      { name: 'twitter:description', content: applicationDescription },
      { name: 'twitter:image', content: '/social-preview.png' },
      {
        name: 'twitter:image:alt',
        content: 'LoanLens loan eligibility estimator',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
