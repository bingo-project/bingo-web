// ABOUTME: Root layout component with navigation
// ABOUTME: Provides consistent header/footer across all pages

import { Outlet, Link } from 'react-router'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react'

export function RootLayout() {
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
            <Link to="/">Home</Link>
          </NavbarItem>
          <NavbarItem>
            <Link to="/about">About</Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <main className="mx-auto max-w-7xl px-4">
        <Outlet />
      </main>
    </div>
  )
}
