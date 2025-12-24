// ABOUTME: Root layout component with navigation
// ABOUTME: Provides consistent header/footer across all pages

import { Outlet, Link } from 'react-router'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from '@heroui/react'
import { useTranslation, i18n, changeLanguage } from '@/locales'

export function RootLayout() {
  const { t } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh-CN' ? 'en-US' : 'zh-CN'
    changeLanguage(newLang)
  }

  return (
    <div className="min-h-screen">
      <Navbar maxWidth="xl">
        <NavbarBrand>
          <Link to="/" className="text-xl font-bold">
            Bingo
          </Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Link to="/">{t('nav.home')}</Link>
          </NavbarItem>
          <NavbarItem>
            <Link to="/about">{t('nav.about')}</Link>
          </NavbarItem>
          <NavbarItem>
            <Button size="sm" variant="flat" onPress={toggleLanguage}>
              {i18n.language === 'zh-CN' ? 'EN' : '中文'}
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <main className="mx-auto max-w-7xl px-4">
        <Outlet />
      </main>
    </div>
  )
}
