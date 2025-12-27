// ABOUTME: Settings page layout with sidebar navigation
// ABOUTME: Provides consistent navigation structure for all settings pages

import { Outlet, NavLink, useNavigate } from 'react-router'
import { Button } from '@heroui/react'
import { User, Shield, Bell, CreditCard, LogOut } from 'lucide-react'
import { useAuthStore } from '@bingo/core'
import { useTranslation } from '@/locales'
import { Header } from '@/components/layout'

const navItems = [
  { key: 'profile', path: '/settings/profile', icon: User },
  { key: 'security', path: '/settings/security', icon: Shield },
  { key: 'notifications', path: '/settings/notifications', icon: Bell, disabled: true },
  { key: 'subscription', path: '/settings/subscription', icon: CreditCard, disabled: true },
]

export function SettingsLayout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showNavLinks={false} />

      <div className="mx-auto flex max-w-[1440px] pt-20">
        {/* Sidebar (Desktop) */}
        <aside className="sticky top-20 hidden h-[calc(100vh-80px)] w-64 flex-col gap-2 overflow-y-auto border-r border-divider p-6 md:flex">
          <div className="mb-4 px-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-default-500">{t('settings.nav.title')}</h3>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-all ${
                    item.disabled
                      ? 'pointer-events-none opacity-50'
                      : isActive
                        ? 'bg-primary font-bold text-white shadow-lg shadow-primary/20'
                        : 'text-default-500 hover:bg-content2 hover:text-foreground'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{t(`settings.nav.${item.key}`)}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto border-t border-divider pt-6">
            <Button
              variant="light"
              color="danger"
              radius="full"
              className="w-full justify-start px-4"
              startContent={<LogOut size={20} />}
              onPress={handleLogout}
            >
              {t('settings.nav.logout')}
            </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Mobile Navigation */}
          <div className="flex w-full items-center gap-2 overflow-x-auto border-b border-divider bg-background px-4 py-3 md:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                    item.disabled
                      ? 'pointer-events-none opacity-50'
                      : isActive
                        ? 'bg-primary text-white'
                        : 'border border-divider bg-content1 text-default-500'
                  }`
                }
              >
                {t(`settings.nav.${item.key}`)}
              </NavLink>
            ))}
          </div>

          {/* Page Content */}
          <main className="p-4 md:p-10 lg:pr-20">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
