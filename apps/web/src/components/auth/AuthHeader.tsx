// ABOUTME: Auth page header component
// ABOUTME: Contains logo, theme/language toggles, and back to home link

import { Link } from 'react-router'
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react'
import { Layers, ArrowLeft, Sun, Moon, Globe } from 'lucide-react'
import { useTheme } from '@/hooks'
import { useTranslation, i18n, changeLanguage, type SupportedLanguage } from '@/locales'

const languages: { key: SupportedLanguage; label: string }[] = [
  { key: 'en-US', label: 'English' },
  { key: 'zh-CN', label: '简体中文' },
]

export function AuthHeader() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-divider bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
            <Layers size={20} />
          </div>
          <span className="text-xl font-medium tracking-tight text-foreground">Bingo</span>
        </Link>

        <div className="flex items-center gap-1">
          <Button
            isIconOnly
            variant="light"
            radius="md"
            onPress={toggleTheme}
            aria-label="Toggle theme"
            className="h-9 w-9 min-w-9 text-default-600"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} className="text-default-600 dark:text-inherit" />}
          </Button>

          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                radius="md"
                aria-label="Switch language"
                className="h-9 w-9 min-w-9 text-default-600"
              >
                <Globe size={18} className="text-default-600 dark:text-inherit" />
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

          <div className="mx-1 h-6 w-px bg-divider" />

          <Button
            as={Link}
            to="/"
            variant="bordered"
            radius="md"
            className="h-9 border-divider px-3 text-sm text-default-600 hover:bg-default-100 hover:text-primary dark:text-default-400"
            startContent={<ArrowLeft size={16} />}
          >
            {t('auth.common.backToHome')}
          </Button>
        </div>
      </div>
    </header>
  )
}
