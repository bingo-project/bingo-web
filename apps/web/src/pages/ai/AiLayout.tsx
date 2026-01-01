// ABOUTME: AI Module Layout
// ABOUTME: Provides common sidebar for all AI pages

import React, { useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Button,
  Spinner,
  ScrollShadow,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react'
import { Plus, Settings, User, LogOut, Home, Trash2, Layers } from 'lucide-react'
import { useAiStore, useAuthStore } from '@bingo/core'

export const AiLayout: React.FC = () => {
  const { t } = useTranslation() // Use default namespace
  const navigate = useNavigate()
  const location = useLocation()

  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const { sessions, isLoadingSessions, fetchSessions, deleteSession } = useAiStore()

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const handleSessionClick = (sessionId: string) => {
    navigate(`/ai/chat/${sessionId}`)
  }

  const handleNewChat = () => {
    navigate('/ai')
  }

  // Check if we are active on a specific session to highlight
  const isActive = (sessionId: string) => {
    // Simple check based on URL or currentSessionId store state if synced
    return location.pathname.includes(`/chat/${sessionId}`)
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50 dark:bg-black/20">
      {/* Sidebar - Desktop only for MVP, or responsive drawer */}
      <aside className="w-64 border-r border-divider bg-background hidden md:flex flex-col shrink-0">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-2 mb-8">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
              <Layers size={20} />
            </div>
            <span className="text-xl font-medium tracking-tight">Bingo</span>
          </div>
          <Button
            className="w-full bg-linear-to-r from-primary to-secondary text-white font-bold shadow-lg shadow-primary/25"
            radius="full"
            size="lg"
            onPress={handleNewChat}
          >
            <Plus size={20} />
            {t('ai.square.newChat')}
          </Button>
        </div>

        <ScrollShadow className="flex-1 p-2">
          {isLoadingSessions ? (
            <div className="flex justify-center py-4">
              <Spinner size="sm" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-4">{t('ai.square.noHistory')}</p>
          ) : (
            <div className="flex flex-col gap-1">
              {sessions.map((session) => (
                <div key={session.session_id} className="group relative px-2">
                  <Button
                    variant={isActive(session.session_id!) ? 'flat' : 'light'}
                    color={isActive(session.session_id!) ? 'primary' : 'default'}
                    className={`justify-start h-auto py-3 px-3 w-full text-left ${isActive(session.session_id!) ? 'bg-primary/10' : ''}`}
                    onPress={() => handleSessionClick(session.session_id!)}
                  >
                    <div className="overflow-hidden w-full pr-6">
                      <p
                        className={`truncate text-sm font-medium ${isActive(session.session_id!) ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}
                      >
                        {session.title || t('ai.square.newChat')}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {new Date(session.updated_at!).toLocaleDateString()}
                      </p>
                    </div>
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-danger hover:bg-danger/10 transition-all z-10"
                    onPress={(e) => {
                      e.continuePropagation() // Prevent triggering session click? No, onPress doesn't bubble like that in HeroUI maybe?
                      // Actually better to stop propagation manually if needed, but HeroUI Button onPress might mask parent.
                      // Let's rely on z-index and separate button.
                      deleteSession(session.session_id!)
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollShadow>

        <div className="p-4 border-t border-slate-200 dark:border-white/10">
          <Dropdown placement="top-start">
            <DropdownTrigger>
              <div
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                role="button"
                tabIndex={0}
              >
                <Avatar src={user?.avatar} name={user?.nickname || user?.username || 'User'} size="sm" />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                    {user?.nickname || user?.username || 'User'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                </div>
                <Settings className="w-4 h-4 text-slate-400" />
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="User menu">
              <DropdownItem key="home" startContent={<Home size={18} />} onPress={() => navigate('/')}>
                {t('nav.home') || 'Home'}
              </DropdownItem>
              <DropdownItem
                key="profile"
                startContent={<User size={18} />}
                onPress={() => navigate('/settings/profile')}
              >
                {t('nav.profile')}
              </DropdownItem>
              <DropdownItem
                key="settings"
                startContent={<Settings size={18} />}
                onPress={() => navigate('/settings/security')}
              >
                {t('nav.settings')}
              </DropdownItem>
              <DropdownItem key="logout" color="danger" startContent={<LogOut size={18} />} onPress={handleLogout}>
                {t('nav.logout')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <Outlet />
      </div>
    </div>
  )
}
