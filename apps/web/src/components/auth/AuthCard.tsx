// ABOUTME: Auth form card container
// ABOUTME: Provides consistent styling for login/register forms

import { Card, CardBody } from '@heroui/react'
import type { ReactNode } from 'react'

interface AuthCardProps {
  children: ReactNode
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <Card
      className="w-full max-w-[440px] border border-slate-200 bg-white shadow-xl dark:border-white/5 dark:bg-[#1e162e] dark:shadow-2xl"
      radius="lg"
    >
      <CardBody className="p-8">{children}</CardBody>
    </Card>
  )
}
