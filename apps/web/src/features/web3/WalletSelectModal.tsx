// ABOUTME: Modal for selecting wallet type
// ABOUTME: Displays available wallet connectors with loading states

import { Modal, ModalContent, ModalHeader, ModalBody, Button, Spinner } from '@heroui/react'
import { useTranslation } from '@/locales'
import type { Connector } from 'wagmi'
import type { WalletLoginStep } from './hooks/useWalletLogin'
import type { WalletBindStep } from './hooks/useWalletBind'

type WalletStep = WalletLoginStep | WalletBindStep

interface Props {
  isOpen: boolean
  onClose: () => void
  connectors: readonly Connector[]
  step: WalletStep
  onSelectConnector: (connectorId: string) => void
}

const connectorIcons: Record<string, string> = {
  injected: '🦊',
  metaMask: '🦊',
  walletConnect: '🔗',
  coinbaseWalletSDK: '💰',
}

const connectorNames: Record<string, string> = {
  injected: 'MetaMask',
  metaMask: 'MetaMask',
  walletConnect: 'WalletConnect',
  coinbaseWalletSDK: 'Coinbase Wallet',
}

export function WalletSelectModal({ isOpen, onClose, connectors, step, onSelectConnector }: Props) {
  const { t } = useTranslation()
  const isLoading = step === 'connecting' || step === 'signing' || step === 'verifying' || step === 'binding'

  const getStepMessage = () => {
    switch (step) {
      case 'connecting':
        return t('auth.wallet.connectingWallet')
      case 'signing':
        return t('auth.wallet.signingMessage')
      case 'verifying':
      case 'binding':
        return t('auth.login.processing')
      default:
        return null
    }
  }

  const stepMessage = getStepMessage()

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()} size="sm" placement="center">
      <ModalContent>
        <ModalHeader>{t('auth.wallet.selectWallet')}</ModalHeader>
        <ModalBody className="pb-6">
          {stepMessage ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Spinner size="lg" />
              <p className="text-default-500">{stepMessage}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {connectors.map((connector) => (
                <Button
                  key={connector.id}
                  variant="bordered"
                  radius="lg"
                  className="h-14 justify-start gap-4 border-divider bg-content2 px-4"
                  onPress={() => onSelectConnector(connector.id)}
                >
                  <span className="text-2xl">{connectorIcons[connector.id] || '👛'}</span>
                  <span className="font-medium">{connectorNames[connector.id] || connector.name}</span>
                </Button>
              ))}
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
