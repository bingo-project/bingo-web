// ABOUTME: Wallet binding section for security settings
// ABOUTME: Allows users to link/unlink wallet address

import { useState } from 'react'
import { Button, Card, CardBody, Chip, useDisclosure } from '@heroui/react'
import { Wallet, CheckCircle, LinkIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/locales'
import { authApi, type SocialBinding } from '@bingo/core'
import { WagmiProvider } from './WagmiProvider'
import { WalletSelectModal } from './WalletSelectModal'
import { useWalletBind } from './hooks/useWalletBind'

interface Props {
  binding: SocialBinding | undefined
  onBindingChange: () => void
}

function WalletBindSectionInner({ binding, onBindingChange }: Props) {
  const { t } = useTranslation()
  const modal = useDisclosure()
  const [isUnbinding, setIsUnbinding] = useState(false)

  const { step, connectors, bind, reset } = useWalletBind({
    onSuccess: () => {
      toast.success(t('settings.security.socialAccounts.linkSuccess', { provider: t('auth.wallet.walletAddress') }))
      modal.onClose()
      onBindingChange()
    },
    onError: (error) => {
      if (error.message === 'pending_request') {
        toast.error(t('auth.wallet.pendingRequest'))
      } else if (error.message.includes('rejected') || error.message.includes('denied')) {
        toast.error(t('auth.wallet.userRejectedConnection'))
      } else {
        toast.error(t('auth.wallet.walletLoginFailed'))
      }
      reset()
    },
  })

  const handleBind = () => {
    modal.onOpen()
  }

  const handleSelectConnector = (connectorId: string) => {
    bind(connectorId)
  }

  const handleUnbind = async () => {
    setIsUnbinding(true)
    try {
      await authApi.unbindProvider('wallet')
      toast.success(t('settings.security.socialAccounts.unlinkSuccess', { provider: t('auth.wallet.walletAddress') }))
      onBindingChange()
    } catch {
      // Error handled by request interceptor
    } finally {
      setIsUnbinding(false)
    }
  }

  const handleClose = () => {
    reset()
    modal.onClose()
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <>
      <Card className="border border-divider bg-content1">
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Wallet className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{t('auth.wallet.walletAddress')}</h3>
                <p className="text-sm text-default-500">
                  {binding ? truncateAddress(binding.accountId) : t('settings.security.socialAccounts.notLinked')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Chip
                color={binding ? 'success' : 'default'}
                variant="flat"
                size="sm"
                startContent={binding ? <CheckCircle size={12} /> : undefined}
              >
                {binding
                  ? t('settings.security.socialAccounts.linked')
                  : t('settings.security.socialAccounts.notLinked')}
              </Chip>
              {binding ? (
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  radius="full"
                  isLoading={isUnbinding}
                  onPress={handleUnbind}
                >
                  {t('settings.security.socialAccounts.unlink')}
                </Button>
              ) : (
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  radius="full"
                  startContent={<LinkIcon size={14} />}
                  onPress={handleBind}
                >
                  {t('settings.security.socialAccounts.link')}
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

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

export function WalletBindSection(props: Props) {
  return (
    <WagmiProvider>
      <WalletBindSectionInner {...props} />
    </WagmiProvider>
  )
}
