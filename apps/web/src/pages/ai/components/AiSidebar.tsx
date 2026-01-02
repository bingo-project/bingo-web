import React from 'react'
import { useNavigate, useLocation, Link } from 'react-router'
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
import { Plus, Settings, User, LogOut, Trash2, Layers, Sun, Moon, Globe } from 'lucide-react'
import { useAiStore, useAuthStore } from '@bingo/core'
import { useTheme } from '@/hooks'
import { changeLanguage, i18n } from '@/locales'

interface AiSidebarProps {
  className?: string
  onClose?: () => void
}

export const AiSidebar: React.FC<AiSidebarProps> = ({ className, onClose }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuthStore()
  const { sessions, isLoadingSessions, deleteSession } = useAiStore()

  const handleLogout = () => {
    logout()
    navigate('/')
    onClose?.()
  }

  const handleSessionClick = (sessionId: string) => {
    navigate(`/ai/chat/${sessionId}`)
    onClose?.()
  }

  const handleNewChat = () => {
    navigate('/ai')
    onClose?.()
  }

  const isActive = (sessionId: string) => {
    return location.pathname.includes(`/chat/${sessionId}`)
  }

  const handleProfile = () => {
    navigate('/settings/profile')
    onClose?.()
  }

  const handleSettings = () => {
    navigate('/settings/security')
    onClose?.()
  }

  return (
    <aside className={`w-64 border-r border-divider bg-background flex-col shrink-0 ${className || ''}`}>
      <div className="p-6 pb-2">
        <Link
          to="/"
          className="flex items-center gap-2 mb-8 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onClose}
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
            <Layers size={20} />
          </div>
          <span className="text-xl font-medium tracking-tight">Bingo</span>
        </Link>
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
              <div key={session.sessionId} className="group relative px-2">
                <Button
                  variant={isActive(session.sessionId!) ? 'flat' : 'light'}
                  color={isActive(session.sessionId!) ? 'primary' : 'default'}
                  className={`justify-start h-auto py-3 px-3 w-full text-left ${isActive(session.sessionId!) ? 'bg-primary/10' : ''}`}
                  onPress={() => handleSessionClick(session.sessionId!)}
                >
                  <div className="overflow-hidden w-full pr-6">
                    <p
                      className={`truncate text-sm font-medium ${isActive(session.sessionId!) ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}
                    >
                      {session.title || t('ai.square.newChat')}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {new Date(session.updatedAt!).toLocaleDateString()}
                    </p>
                  </div>
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-danger hover:bg-danger/10 transition-all z-10"
                  onPress={(e) => {
                    e.continuePropagation()
                    deleteSession(session.sessionId!)
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
            <DropdownItem
              key="switch-theme"
              startContent={
                <div className="flex items-center">
                  <Sun size={18} className="dark:hidden" />
                  <Moon size={18} className="hidden dark:block" />
                </div>
              }
              onPress={toggleTheme}
            >
              {theme === 'dark' ? t('theme.lightMode') : t('theme.darkMode')}
            </DropdownItem>
            <DropdownItem
              key="switch-lang"
              showDivider
              startContent={<Globe size={18} />}
              onPress={() => changeLanguage(i18n.language === 'en-US' ? 'zh-CN' : 'en-US')}
            >
              {i18n.language === 'en-US' ? '简体中文' : 'English'}
            </DropdownItem>
            <DropdownItem key="profile" startContent={<User size={18} />} onPress={handleProfile}>
              {t('nav.profile')}
            </DropdownItem>
            <DropdownItem key="settings" startContent={<Settings size={18} />} onPress={handleSettings}>
              {t('nav.settings')}
            </DropdownItem>
            <DropdownItem key="logout" color="danger" startContent={<LogOut size={18} />} onPress={handleLogout}>
              {t('nav.logout')}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </aside>
  )
}
