import { describe, expect, it } from 'vitest'
import { copyNumbers } from './copies'

describe('copyNumbers', () => {
  it('numbers every copy from 01 through the total', () => {
    expect(copyNumbers('04', '01')).toEqual(['01', '02', '03', '04'])
  })

  it('treats a blank total as a single copy and caps a huge total', () => {
    expect(copyNumbers('', '01')).toEqual(['01'])
    expect(copyNumbers('80', '01')).toHaveLength(30)
  })
})
