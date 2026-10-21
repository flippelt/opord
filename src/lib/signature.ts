/** Fontes cursivas para a assinatura. Todas livres (OFL ou Apache), via @fontsource. */
export const SIGNATURE_FONTS: { id: string; label: string; family: string; scale: number }[] = [
  { id: 'mrs-saint-delafield', label: 'Mrs Saint Delafield', family: "'Mrs Saint Delafield'", scale: 1.25 },
  { id: 'herr-von-muellerhoff', label: 'Herr Von Muellerhoff', family: "'Herr Von Muellerhoff'", scale: 1.3 },
  { id: 'monsieur-la-doulaise', label: 'Monsieur La Doulaise', family: "'Monsieur La Doulaise'", scale: 1.15 },
  { id: 'la-belle-aurore', label: 'La Belle Aurore', family: "'La Belle Aurore'", scale: 0.95 },
  { id: 'cedarville-cursive', label: 'Cedarville Cursive', family: "'Cedarville Cursive'", scale: 0.9 },
  { id: 'homemade-apple', label: 'Homemade Apple', family: "'Homemade Apple'", scale: 0.75 },
  { id: 'zeyada', label: 'Zeyada', family: "'Zeyada'", scale: 1.05 },
  { id: 'dancing-script', label: 'Dancing Script', family: "'Dancing Script'", scale: 0.9 },
]

export function signatureFont(id: string) {
  return SIGNATURE_FONTS.find((f) => f.id === id) ?? SIGNATURE_FONTS[0]
}
