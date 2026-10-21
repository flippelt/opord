/** Fontes cursivas para a assinatura: as livres vêm do @fontsource; as de uso pessoal, de src/assets/fonts. */
export const SIGNATURE_FONTS: { id: string; label: string; family: string; scale: number }[] = [
  { id: 'mrs-saint-delafield', label: 'Mrs Saint Delafield', family: "'Mrs Saint Delafield'", scale: 1.25 },
  { id: 'herr-von-muellerhoff', label: 'Herr Von Muellerhoff', family: "'Herr Von Muellerhoff'", scale: 1.3 },
  { id: 'monsieur-la-doulaise', label: 'Monsieur La Doulaise', family: "'Monsieur La Doulaise'", scale: 1.15 },
  { id: 'la-belle-aurore', label: 'La Belle Aurore', family: "'La Belle Aurore'", scale: 0.95 },
  { id: 'cedarville-cursive', label: 'Cedarville Cursive', family: "'Cedarville Cursive'", scale: 0.9 },
  { id: 'homemade-apple', label: 'Homemade Apple', family: "'Homemade Apple'", scale: 0.75 },
  { id: 'zeyada', label: 'Zeyada', family: "'Zeyada'", scale: 1.05 },
  { id: 'dancing-script', label: 'Dancing Script', family: "'Dancing Script'", scale: 0.9 },
  { id: 'attallia', label: 'Attallia', family: "'Attallia'", scale: 1.1 },
  { id: 'autograf', label: 'Autograf', family: "'Autograf'", scale: 0.8 },
  { id: 'bastliga-one', label: 'Bastliga One', family: "'Bastliga One'", scale: 1.15 },
  { id: 'honofly', label: 'Honofly', family: "'Honofly'", scale: 0.75 },
  { id: 'montreuil', label: 'Montreuil', family: "'Montreuil'", scale: 1.3 },
  { id: 'patricia-wilcie', label: 'Patricia Wilcie', family: "'Patricia Wilcie'", scale: 1.25 },
  { id: 'the-scientist', label: 'The Scientist', family: "'The Scientist'", scale: 0.8 },
]

export function signatureFont(id: string) {
  return SIGNATURE_FONTS.find((f) => f.id === id) ?? SIGNATURE_FONTS[0]
}
