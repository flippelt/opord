import { slug } from './dtg'

export function fileBase(parts: string[]): string {
  const s = parts.map((p) => slug(p)).filter(Boolean).join('-')
  return s || 'OPORD'
}

export async function captureSheet(el: HTMLElement): Promise<string> {
  const { toPng } = await import('html-to-image')
  await document.fonts.ready
  const bg = getComputedStyle(el).backgroundColor || '#efe6d0'
  return toPng(el, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: bg,
    style: { transform: 'none', margin: '0' },
  })
}

export async function captureAll(sheets: HTMLElement[]): Promise<string[]> {
  const out: string[] = []
  for (const el of sheets) out.push(await captureSheet(el))
  return out
}

export async function savePdf(pngs: string[], filename: string) {
  const { jsPDF } = await import('jspdf')
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  pngs.forEach((png, i) => {
    if (i > 0) pdf.addPage()
    pdf.addImage(png, 'PNG', 0, 0, 210, 297)
  })
  pdf.save(filename)
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const b64 = dataUrl.split(',')[1] ?? ''
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

export async function savePngZip(pngs: string[], zipName: string, pageNames: string[]) {
  const { zipSync } = await import('fflate')
  const files: Record<string, Uint8Array> = {}
  pngs.forEach((png, i) => {
    const name = pageNames[i] ?? `pagina-${i + 1}.png`
    files[name] = dataUrlToBytes(png)
  })
  const zipped = zipSync(files)
  const blob = new Blob([zipped], { type: 'application/zip' })
  downloadBlob(blob, zipName)
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  downloadBlob(blob, filename)
}
