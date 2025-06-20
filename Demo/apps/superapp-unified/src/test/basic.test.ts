import { describe, it, expect } from 'vitest'

describe('Vitest Configuration', () => {
  it('should be able to run basic tests', () => {
    expect(true).toBe(true)
  })

  it('should have access to vitest globals', () => {
    expect(describe).toBeDefined()
    expect(it).toBeDefined()
    expect(expect).toBeDefined()
  })

  it('should support TypeScript', () => {
    const num: number = 42
    const str: string = 'CoomÜnity'

    expect(typeof num).toBe('number')
    expect(typeof str).toBe('string')
    expect(str).toContain('CoomÜnity')
  })
})

describe('Environment Setup', () => {
  it('should have jsdom environment available', () => {
    expect(window).toBeDefined()
    expect(document).toBeDefined()
    expect(global).toBeDefined()
  })

  it('should have testing utilities available', () => {
    // Los mocks deberían estar disponibles desde el setup
    expect(window.matchMedia).toBeDefined()
    expect(global.ResizeObserver).toBeDefined()
    expect(global.IntersectionObserver).toBeDefined()
  })
})
