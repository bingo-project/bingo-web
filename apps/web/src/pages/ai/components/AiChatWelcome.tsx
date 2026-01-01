// ABOUTME: AI Chat Welcome Screen
// ABOUTME: Displayed when creating a new chat or when history is empty

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Textarea, Button } from '@heroui/react'
import { Send, Sparkles } from 'lucide-react'

interface AiChatWelcomeProps {
  onSend: (message: string) => void
}

export const AiChatWelcome: React.FC<AiChatWelcomeProps> = ({ onSend }) => {
  const { t } = useTranslation()
  const [input, setInput] = React.useState('')

  const handleSend = () => {
    if (!input.trim()) return
    onSend(input)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestions = [
    {
      title: t('ai.welcome.suggestions.debug'),
      desc: t('ai.welcome.suggestions.debugDesc'),
      prompt: 'Debug my code: ',
    },
    {
      title: t('ai.welcome.suggestions.article'),
      desc: t('ai.welcome.suggestions.articleDesc'),
      prompt: 'Write an article about AI trends.',
    },
    {
      title: t('ai.welcome.suggestions.concept'),
      desc: t('ai.welcome.suggestions.conceptDesc'),
      prompt: 'Explain quantum computing simply.',
    },
    {
      title: t('ai.welcome.suggestions.trip'),
      desc: t('ai.welcome.suggestions.tripDesc'),
      prompt: 'Plan a 3-day trip to Tokyo.',
    },
  ]

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto w-full animate-in fade-in duration-500">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="size-20 mb-6 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white shadow-xl shadow-primary/30">
              <Sparkles size={40} />
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-900 dark:text-white mb-3">
              {t('ai.welcome.title')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md">{t('ai.welcome.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {suggestions.map((item, index) => (
              <button
                key={index}
                onClick={() => onSend(item.prompt)}
                className="text-left p-4 rounded-xl border border-divider hover:border-primary/50 bg-content1 hover:bg-content2 transition-all group"
              >
                <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-sm text-default-500">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 bg-background">
        <div className="max-w-3xl mx-auto w-full relative group">
          <Textarea
            minRows={1}
            maxRows={8}
            placeholder={t('ai.chat.inputPlaceholder')}
            value={input}
            onValueChange={setInput}
            onKeyDown={handleKeyDown}
            classNames={{
              input: 'pr-12 py-4',
              inputWrapper:
                'bg-content1 border-divider rounded-2xl shadow-sm hover:border-default-400 focus-within:!border-primary/50',
            }}
          />
          <div className="absolute right-2 bottom-2 z-10">
            <Button
              isIconOnly
              size="sm"
              radius="full"
              className={
                input.trim()
                  ? 'bg-linear-to-r from-primary to-secondary text-white'
                  : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500'
              }
              isDisabled={!input.trim()}
              onPress={handleSend}
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">{t('ai.chat.disclaimer')}</p>
      </div>
    </div>
  )
}
