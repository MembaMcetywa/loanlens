import { networkInterfaces } from 'node:os'

import encodeQR from 'qr'
import { createServer } from 'vite'

function getLocalIpv4Address() {
  for (const addresses of Object.values(networkInterfaces())) {
    const address = addresses?.find(
      ({ address, family, internal }) =>
        family === 'IPv4' && !internal && !address.startsWith('169.254.'),
    )

    if (address) {
      return address.address
    }
  }

  throw new Error('No local IPv4 network address was found.')
}

const port = 3000
const mobileUrl = `http://${getLocalIpv4Address()}:${port}`
const server = await createServer({
  server: {
    host: '0.0.0.0',
    port,
    strictPort: true,
  },
})

await server.listen()

console.log(`\nOpen LoanLens on your phone: ${mobileUrl}\n`)
console.log(encodeQR(mobileUrl, 'term'))
console.log('Your computer and phone must use the same local network.\n')
