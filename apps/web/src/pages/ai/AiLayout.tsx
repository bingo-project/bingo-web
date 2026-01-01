// ABOUTME: AI Module Layout
// ABOUTME: Provides common sidebar for all AI pages

import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, Link } from 'react-router'
import { Button } from '@heroui/react'
import { Layers, Menu, Plus } from 'lucide-react'
import { useAiStore } from '@bingo/core'
import { AiSidebar } from './components/AiSidebar'

export const AiLayout: React.FC = () => {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { fetchSessions } = useAiStore()

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const handleNewChat = () => {
    navigate('/ai')
  }

  // Check if we are active on a specific session to highlight

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-black/20">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-background/80 backdrop-blur-md border-b border-divider z-40 flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          <Button isIconOnly variant="light" size="sm" onPress={() => setIsMobileMenuOpen(true)}>
            <Menu size={20} />
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-white">
              <Layers size={14} />
            </div>
            <span className="text-lg font-medium tracking-tight">Bingo</span>
          </Link>
        </div>
        <Button isIconOnly size="sm" variant="flat" color="primary" radius="full" onPress={handleNewChat}>
          <Plus size={18} />
        </Button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sidebar content */}
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-background shadow-2xl transition-transform transform translate-x-0">
            <AiSidebar onClose={() => setIsMobileMenuOpen(false)} className="h-full border-none" />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <AiSidebar className="hidden md:flex relative z-30" />

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative pt-14 md:pt-0">
        <Outlet />
      </div>
    </div>
  )
}
