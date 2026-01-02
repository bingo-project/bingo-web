import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Card, CardBody, Button, Spinner, Input } from '@heroui/react'
import { Bot, Search } from 'lucide-react'
import { useAiStore } from '@bingo/core'
import { toast } from 'sonner'

export const AiSquarePage: React.FC = () => {
  const { t } = useTranslation() // Use default namespace
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const { agents, isLoadingAgents, fetchAgents, createSession } = useAiStore()

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  const filteredAgents = useMemo(() => {
    if (!searchQuery.trim()) return agents
    const query = searchQuery.toLowerCase()
    return agents.filter(
      (agent) =>
        agent.name?.toLowerCase().includes(query) ||
        agent.description?.toLowerCase().includes(query) ||
        agent.category?.toLowerCase().includes(query)
    )
  }, [agents, searchQuery])

  const handleAgentClick = async (agentModel: string, agentName: string, agentId?: string) => {
    try {
      const modelToUse = agentModel || 'glm-4-flash'
      const sessionId = await createSession(modelToUse, agentName, agentId)
      navigate(`/ai/chat/${sessionId}`)
    } catch (error) {
      console.error(error)
      toast.error(t('ai.square.createFailed'))
    }
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 h-full">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary inline-block mb-2">
              {t('ai.square.title')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">{t('ai.square.subtitle')}</p>
          </div>
          <div className="w-full md:w-72">
            <Input
              classNames={{
                base: 'max-w-full sm:max-w-[20rem] h-10',
                mainWrapper: 'h-full',
                input: 'text-small',
                inputWrapper: 'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
              }}
              placeholder={t('ai.square.searchPlaceholder')}
              size="sm"
              startContent={<Search size={18} />}
              type="search"
              value={searchQuery}
              onValueChange={setSearchQuery}
              radius="full"
            />
          </div>
        </header>

        {isLoadingAgents ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredAgents.map((agent, index) => (
              <Card
                key={agent.model || index}
                isHoverable
                isPressable
                className="border border-transparent hover:border-primary/20 transition-all duration-300 group"
                onPress={() => handleAgentClick(agent.model!, agent.name!, agent.agentId)}
              >
                <CardBody className="p-5 flex flex-col h-full items-start text-left">
                  <div className="flex justify-between items-start w-full mb-4">
                    <div className="p-3 rounded-full bg-linear-to-br from-primary/10 to-secondary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                      {agent.icon ? (
                        <img src={agent.icon} alt={agent.name} className="w-8 h-8" />
                      ) : (
                        <Bot className="w-8 h-8" />
                      )}
                    </div>
                    {agent.category && (
                      <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {agent.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{agent.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 grow">
                    {agent.description}
                  </p>

                  <Button
                    className="w-full h-7 min-h-0 bg-content2 text-foreground font-medium group-hover:bg-linear-to-r group-hover:from-primary group-hover:to-secondary group-hover:text-white transition-all shadow-none group-hover:shadow-md flex items-center justify-center text-xs"
                    radius="full"
                    onPress={(e) => {
                      // Prevent card click
                      if (e && typeof e.continuePropagation === 'function') {
                        e.continuePropagation()
                      }
                      handleAgentClick(agent.model!, agent.name!, agent.agentId)
                    }}
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
