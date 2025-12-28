// ABOUTME: Wallet login button with modal integration
// ABOUTME: Handles the complete wallet login flow

import { useState } from 'react'
import { Button, useDisclosure } from '@heroui/react'
import { Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'
import { useTranslation } from '@/locales'
import { WagmiProvider } from './WagmiProvider'
import { WalletSelectModal } from './WalletSelectModal'
import { useWalletLogin } from './hooks/useWalletLogin'

interface Props {
  redirectTo?: string
  disabled?: boolean
}

function WalletLoginButtonInner({ redirectTo = '/', disabled }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const modal = useDisclosure()
  const [isButtonLoading, setIsButtonLoading] = useState(false)

  const { step, login, reset, connectors } = useWalletLogin({
    onSuccess: () => {
      toast.success(t('auth.login.success'))
      modal.onClose()
      navigate(redirectTo)
    },
    onError: (error) => {
      if (error.message.includes('rejected') || error.message.includes('denied')) {
        toast.error(t('auth.wallet.userRejectedConnection'))
      } else {
        toast.error(t('auth.wallet.walletLoginFailed'))
      }
      reset()
    },
  })

  const handleButtonClick = () => {
    setIsButtonLoading(true)
    modal.onOpen()
    setIsButtonLoading(false)
  }

  const handleSelectConnector = (connectorId: string) => {
    login(connectorId)
  }

  const handleClose = () => {
    reset()
    modal.onClose()
  }

  return (
    <>
      <Button
        variant="bordered"
        radius="full"
        isLoading={isButtonLoading}
        isDisabled={disabled}
        className="h-12 border-divider bg-content2 text-foreground"
        startContent={!isButtonLoading && <Wallet className="h-5 w-5" />}
        onPress={handleButtonClick}
      >
        {t('auth.wallet.walletLogin')}
      </Button>

      <WalletSelectModal
        isOpen={modal.isOpen}
        onClose={handleClose}
        connectors={connectors}
        step={step}
        onSelectConnector={handleSelectConnector}
      />
    </>
  )
}

export function WalletLoginButton(props: Props) {
  return (
    <WagmiProvider>
      <WalletLoginButtonInner {...props} />
    </WagmiProvider>
  )
}
