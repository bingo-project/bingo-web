// ABOUTME: Landing page header with navigation
// ABOUTME: Fixed header with logo, nav links, theme toggle, and auth state

import { Link, useNavigate } from 'react-router'
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from '@heroui/react'
import { Layers, Sun, Moon, User, Settings, LogOut, Globe } from 'lucide-react'
import { NotificationDropdown } from '@/components/notification'
import { useAuthStore } from '@bingo/core'
import { useWebSocketStatus, type ConnectionState } from '@bingo/websocket'
import { useTheme } from '@/hooks'
import { useTranslation, i18n, changeLanguage, type SupportedLanguage } from '@/locales'

const NAV_LINKS = [
  { href: '#features', labelKey: 'nav.features' },
  { href: '#pricing', labelKey: 'nav.pricing' },
  { href: '#faq', labelKey: 'nav.faq' },
] as const

interface HeaderProps {
  showNavLinks?: boolean
}

function getStatusColor(status: ConnectionState | null): string {
  if (!status) return 'bg-green-500'
  switch (status) {
    case 'authenticated':
      return 'bg-green-500'
    case 'connected':
    case 'connecting':
    case 'reconnecting':
      return 'bg-yellow-500'
    case 'disconnected':
    default:
      return 'bg-default-400'
  }
}

export function Header({ showNavLinks = true }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const wsStatus = useWebSocketStatus()

  const { isAuthenticated, user, logout } = useAuthStore()

  const languages: { key: SupportedLanguage; label: string }[] = [
    { key: 'en-US', label: 'English' },
    { key: 'zh-CN', label: '简体中文' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-divider bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
              <Layers size={20} />
            </div>
            <span className="text-xl font-medium tracking-tight">Bingo</span>
          </Link>

          {/* Navigation */}
          {showNavLinks && (
            <nav className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {t(link.labelKey)}
                </a>
              ))}
            </nav>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button isIconOnly variant="light" radius="full" onPress={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} className="text-default-700 dark:text-inherit" />}
            </Button>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  aria-label="Switch language"
                  className="hidden sm:flex"
                >
                  <Globe size={20} className="text-default-700 dark:text-inherit" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Language selection"
                selectedKeys={[i18n.language]}
                selectionMode="single"
                onAction={(key) => changeLanguage(key as SupportedLanguage)}
              >
                {languages.map((lang) => (
                  <DropdownItem key={lang.key}>{lang.label}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <div className="mx-1 hidden h-6 w-px bg-divider sm:block" />

            {isAuthenticated ? (
              /* Logged in state */
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <NotificationDropdown />

                {/* User info & dropdown */}
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <div className="flex cursor-pointer items-center gap-3">
                      <div className="hidden text-right sm:block">
                        <p className="text-sm font-bold leading-none">{user?.nickname || 'User'}</p>
                        <p className="mt-1 text-xs text-default-500">{user?.email}</p>
                      </div>
                      <div className="relative">
                        <Avatar
                          src={user?.avatar}
                          name={user?.nickname || user?.email}
                          size="sm"
                          className="ring-2 ring-transparent transition-all hover:ring-primary"
                        />
                        <span
                          className={`absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-background ${getStatusColor(wsStatus)}`}
                        />
                      </div>
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="User menu">
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
                    <DropdownItem
                      key="logout"
                      color="danger"
                      startContent={<LogOut size={18} />}
                      onPress={handleLogout}
                    >
                      {t('nav.logout')}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            ) : (
              /* Logged out state */
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="bordered"
                  radius="full"
                  className="hidden h-10 w-24 items-center justify-center border-divider px-5 font-medium hover:bg-default-100 sm:inline-flex"
                >
                  {t('nav.login')}
                </Button>

                <Button
                  as={Link}
                  to="/register"
                  color="primary"
                  radius="full"
                  className="inline-flex h-10 w-32 items-center justify-center bg-gradient-primary px-5 font-medium text-white hover:shadow-lg hover:shadow-primary/25"
                >
                  {t('nav.getStarted')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
