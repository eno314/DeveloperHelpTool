import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.css'
import { headers } from 'next/headers'

export default async function RootLayout ({
  children
}: {
  children: React.ReactNode
}): Promise<React.JSX.Element> {
  const nonce = (await headers()).get('x-nonce') ?? ''

  return (
    <html lang="en">
      <head nonce={nonce}>
        <meta httpEquiv="Content-Security-Policy" content={`object-src 'none'; base-uri 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: 'nonce-${nonce}' 'strict-dynamic'`} />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
