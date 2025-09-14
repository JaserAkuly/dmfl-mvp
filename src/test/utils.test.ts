import { describe, it, expect } from 'vitest'
import { formatPlayerName, formatRecord, generateSlug } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('formatPlayerName', () => {
    it('formats full name correctly', () => {
      expect(formatPlayerName('John', 'Doe')).toBe('John Doe')
    })

    it('formats short name correctly', () => {
      expect(formatPlayerName('John', 'Doe', true)).toBe('J. Doe')
    })
  })

  describe('formatRecord', () => {
    it('formats win-loss record without ties', () => {
      expect(formatRecord(5, 3, 0)).toBe('5-3')
    })

    it('formats win-loss-tie record with ties', () => {
      expect(formatRecord(5, 3, 1)).toBe('5-3-1')
    })
  })

  describe('generateSlug', () => {
    it('generates slug from team name', () => {
      expect(generateSlug('Dallas Thunder')).toBe('dallas-thunder')
    })

    it('handles special characters', () => {
      expect(generateSlug('Team #1 & Co.')).toBe('team-1--co')
    })

    it('handles multiple spaces', () => {
      expect(generateSlug('Team   Name')).toBe('team-name')
    })
  })
})