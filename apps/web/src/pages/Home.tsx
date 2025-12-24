// ABOUTME: Home page component
// ABOUTME: Displays the landing page content

import { Button } from '@heroui/react'

export function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Bingo Web</h1>
        <p className="mb-6 text-gray-600">Welcome to Bingo Web</p>
        <Button color="primary">Get Started</Button>
      </div>
    </div>
  )
}
