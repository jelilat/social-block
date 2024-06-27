'use client'

import { ConnectButton } from 'thirdweb/react'
import { createThirdwebClient } from 'thirdweb'
import { createWallet, inAppWallet } from 'thirdweb/wallets'
import { baseSepolia } from 'thirdweb/chains'

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID!
const client = createThirdwebClient({ clientId })
const wallets = [
  inAppWallet({
    smartAccount: {
      chain: baseSepolia,
      sponsorGas: true,
    },
  }),
  createWallet('walletConnect'),
]
const chain = baseSepolia

export default function WalletConnect() {
  return (
    <div>
      <ConnectButton
        client={client}
        wallets={wallets}
        chain={chain}
        connectButton={{
          label: 'Sign in',
          className: '',
        }}
      />
    </div>
  )
}
