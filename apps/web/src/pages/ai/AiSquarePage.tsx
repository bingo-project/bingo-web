// ABOUTME: Displays list of AI roles
// ABOUTME: Used as index page for /ai route, inside AiLayout

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Card, CardBody, Button, Spinner } from '@heroui/react'
import { Bot } from 'lucide-react'
import { useAiStore } from '@bingo/core'
import { toast } from 'sonner'

export const AiSquarePage: React.FC = () => {
  const { t } = useTranslation() // Use default namespace
  const navigate = useNavigate()

  const { roles, isLoadingRoles, fetchRoles, createSession } = useAiStore()

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  const handleRoleClick = async (roleModel: string, roleName: string) => {
    try {
      const modelToUse = roleModel || 'glm-4-flash'
      const sessionId = await createSession(modelToUse, roleName)
      navigate(`/ai/chat/${sessionId}`)
    } catch (error) {
      console.error(error)
      toast.error(t('ai.square.createFailed'))
    }
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 h-full">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary inline-block mb-2">
            {t('ai.square.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">{t('ai.square.subtitle')}</p>
        </header>

        {isLoadingRoles ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {roles.map((role, index) => (
              <Card
                key={role.model || index}
                isHoverable
                className="border border-transparent hover:border-primary/20 transition-all duration-300 group cursor-pointer"
                onPress={() => handleRoleClick(role.model!, role.name!)}
              >
                <CardBody className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-full bg-linear-to-br from-primary/10 to-secondary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                      {role.icon ? (
                        <img src={role.icon} alt={role.name} className="w-8 h-8" />
                      ) : (
                        <Bot className="w-8 h-8" />
                      )}
                    </div>
                    {role.category && (
                      <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {role.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{role.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 flex-grow">
                    {role.description}
                  </p>

                  <Button
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium group-hover:bg-linear-to-r group-hover:from-primary group-hover:to-secondary group-hover:text-white transition-all shadow-none group-hover:shadow-md"
                    radius="full"
                    size="sm"
                  >
                    {t('ai.square.startChat')}
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
