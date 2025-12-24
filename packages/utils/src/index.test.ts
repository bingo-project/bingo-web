// ABOUTME: Unit tests for utils package
// ABOUTME: Demonstrates Vitest testing patterns

import { describe, it, expect } from 'vitest'
import { formatDate } from './index'

describe('formatDate', () => {
  it('should format date to ISO string', () => {
    const date = new Date('2025-01-01T00:00:00.000Z')
    expect(formatDate(date)).toBe('2025-01-01T00:00:00.000Z')
  })

  it('should handle current date', () => {
    const now = new Date()
    const result = formatDate(now)
    expect(result).toBe(now.toISOString())
  })
})
