export const STAMP_TERMS = [
  'CLASSIFIED',
  'UNCLASSIFIED',
  'RESTRICTED',
  'CONFIDENTIAL',
  'SECRET',
  'TOP SECRET',
] as const

export function stampTerm(title: string): (typeof STAMP_TERMS)[number] | 'custom' {
  const text = title.trim().toUpperCase()
  return (STAMP_TERMS as readonly string[]).includes(text)
    ? (text as (typeof STAMP_TERMS)[number])
    : 'custom'
}
