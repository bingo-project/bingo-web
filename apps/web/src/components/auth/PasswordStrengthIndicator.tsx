// ABOUTME: Password strength indicator with visual bar and requirements checklist
// ABOUTME: Real-time validation for password requirements

import { useMemo } from 'react'
import { Check, X } from 'lucide-react'
import { useTranslation } from '@/locales'

interface PasswordStrengthIndicatorProps {
  password: string
}

interface Requirement {
  key: string
  check: (password: string) => boolean
}

const requirements: Requirement[] = [
  { key: 'minLength', check: (p) => p.length >= 8 },
  { key: 'hasCase', check: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { key: 'hasNumber', check: (p) => /\d/.test(p) },
]

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const { t } = useTranslation()

  const results = useMemo(
    () =>
      requirements.map((req) => ({
        key: req.key,
        passed: req.check(password),
      })),
    [password]
  )

  const passedCount = results.filter((r) => r.passed).length
  const strength = password.length === 0 ? 0 : passedCount

  const strengthColor = useMemo(() => {
    if (strength === 0) return 'bg-default-200'
    if (strength === 1) return 'bg-danger'
    if (strength === 2) return 'bg-warning'
    return 'bg-success'
  }, [strength])

  const strengthLabel = useMemo(() => {
    if (strength === 0) return ''
    if (strength === 1) return t('auth.passwordStrength.weak')
    if (strength === 2) return t('auth.passwordStrength.medium')
    return t('auth.passwordStrength.strong')
  }, [strength, t])

  return (
    <div className="flex flex-col gap-3">
      {/* Strength bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex h-1.5 gap-1">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={`h-full flex-1 rounded-full transition-colors ${
                strength >= level ? strengthColor : 'bg-default-200'
              }`}
            />
          ))}
        </div>
        {strengthLabel && (
          <span
            className={`text-xs ${strength === 1 ? 'text-danger' : strength === 2 ? 'text-warning' : 'text-success'}`}
          >
            {strengthLabel}
          </span>
        )}
      </div>

      {/* Requirements checklist */}
      <div className="flex flex-col gap-1.5">
        {results.map(({ key, passed }) => (
          <div key={key} className="flex items-center gap-2">
            {passed ? <Check size={14} className="text-success" /> : <X size={14} className="text-default-400" />}
            <span className={`text-xs ${passed ? 'text-success' : 'text-default-500'}`}>
              {t(`auth.passwordStrength.requirements.${key}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
