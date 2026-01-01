// ABOUTME: Displays chat history and message input with streaming support

import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Avatar, Button, Textarea, Spinner, ScrollShadow } from '@heroui/react'
import { Send, ArrowLeft } from 'lucide-react'
import { useAiStore } from '@bingo/core'
import { toast } from 'sonner'
import { AiChatWelcome } from './components/AiChatWelcome'
import ReactMarkdown from 'react-markdown'
// @ts-expect-error No types available
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// @ts-expect-error No types available
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export const AiChatPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [input, setInput] = useState('')

  const { messages, sessions, isLoadingHistory, isSendingMessage, setCurrentSession, fetchHistory, sendMessage } =
    useAiStore()

  const sessionMessages = useMemo(() => {
    return sessionId ? messages[sessionId] || [] : []
  }, [sessionId, messages])
  const currentSession = sessions.find((s) => s.session_id === sessionId)

  useEffect(() => {
    if (sessionId) {
      setCurrentSession(sessionId)
      fetchHistory(sessionId).catch(() => {
        toast.error(t('ai.chat.loadFailed'))
        navigate('/ai')
      })
    }
  }, [sessionId, setCurrentSession, fetchHistory, navigate, t])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [sessionMessages])

  const handleSend = async (msg?: string) => {
    const content = msg || input
    if (!content.trim() || !sessionId || isSendingMessage) return

    setInput('')

    try {
      const model = currentSession?.model || 'glm-4-flash'
      await sendMessage(content, model)
    } catch (error) {
      console.error(error)
      toast.error(t('ai.chat.sendFailed'))
      setInput(content) // Restore input on fail
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (isLoadingHistory && sessionMessages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isLoadingHistory && sessionMessages.length === 0) {
    return <AiChatWelcome onSend={handleSend} />
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="flex items-center px-4 py-3 border-b border-divider bg-background/80 backdrop-blur-md sticky top-0 z-10 md:hidden">
        <Button isIconOnly variant="light" onPress={() => navigate('/ai')} className="mr-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
            {currentSession?.title || t('ai.chat.defaultTitle')}
          </h1>
        </div>
      </header>

      {/* Messages */}
      <ScrollShadow className="flex-1 p-4 md:p-6 space-y-6">
        {sessionMessages.map((msg, idx) => {
          const isUser = msg.role === 'user'
          return (
            <div key={idx} className={`flex gap-4 w-full ${isUser ? 'flex-row-reverse' : ''}`}>
              <Avatar
                showFallback
                src={isUser ? undefined : 'https://api.dicebear.com/7.x/bottts/svg?seed=' + currentSession?.model}
                name={isUser ? t('ai.chat.you') : t('ai.chat.ai')}
                className="shrink-0"
              />

              <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-xs font-semibold text-slate-500">
                    {isUser ? t('ai.chat.you') : t('ai.chat.ai')}
                  </span>
                </div>

                <div
                  className={`
                    p-4 rounded-2xl text-sm md:text-base leading-relaxed overflow-hidden
                    ${
                      isUser
                        ? 'bg-linear-to-br from-primary to-primary-600 text-white rounded-tr-none shadow-md shadow-primary/20'
                        : 'bg-content2 text-foreground rounded-tl-none border border-divider'
                    }
                 `}
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <ReactMarkdown
                      components={{
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        code({ className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '')
                          return match ? (
                            <SyntaxHighlighter
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              {...(props as any)}
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          )
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </ScrollShadow>

      {/* Input Area */}
      <div className="p-4 bg-background sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto relative group">
          <Textarea
            placeholder={t('ai.chat.inputPlaceholder')}
            minRows={1}
            maxRows={6}
            value={input}
            onValueChange={setInput}
            onKeyDown={handleKeyDown}
            classNames={{
              input: 'pr-14 py-3',
              inputWrapper: 'rounded-[24px] pr-2 shadow-sm hover:shadow-md transition-shadow',
            }}
          />
          <div className="absolute right-3 bottom-2">
            <Button
              isIconOnly
              className="bg-primary text-white shadow-lg rounded-full w-8 h-8 min-w-0"
              size="sm"
              onPress={handleSend}
              isLoading={isSendingMessage}
              isDisabled={!input.trim() || isSendingMessage}
            >
              {!isSendingMessage && <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2">{t('ai.chat.disclaimer')}</p>
      </div>
    </div>
  )
}
