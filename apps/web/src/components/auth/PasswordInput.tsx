// ABOUTME: Password input with visibility toggle
// ABOUTME: Wraps HeroUI Input with show/hide functionality

import { useState, forwardRef } from 'react'
import { Input, type InputProps } from '@heroui/react'
import { Eye, EyeOff } from 'lucide-react'

type PasswordInputProps = Omit<InputProps, 'type' | 'endContent'>

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>((props, ref) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Input
      {...props}
      ref={ref}
      type={isVisible ? 'text' : 'password'}
      classNames={{
        input: 'pl-1',
        innerWrapper: 'gap-2',
        ...props.classNames,
      }}
      endContent={
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="shrink-0 text-slate-400 transition-colors hover:text-slate-600 focus:outline-none dark:hover:text-slate-200"
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      }
    />
  )
})

PasswordInput.displayName = 'PasswordInput'
