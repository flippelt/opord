function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Falha ao ler a imagem'))
    img.src = url
  })
}

export async function fileToDataUrl(
  file: File,
  opts: { maxEdge: number; quality: number; keepAlpha: boolean },
): Promise<string> {
  const objectUrl = URL.createObjectURL(file)
  try {
    const img = await loadImage(objectUrl)
    const scale = Math.min(1, opts.maxEdge / Math.max(img.width, img.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(img.width * scale))
    canvas.height = Math.max(1, Math.round(img.height * scale))
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas indisponível')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    if (opts.keepAlpha || file.type === 'image/png') {
      return canvas.toDataURL('image/png')
    }
    return canvas.toDataURL('image/jpeg', opts.quality)
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export function readClanMark(file: File): Promise<string> {
  return fileToDataUrl(file, { maxEdge: 900, quality: 0.9, keepAlpha: true })
}

export function readIntelPhoto(file: File): Promise<string> {
  return fileToDataUrl(file, { maxEdge: 1600, quality: 0.82, keepAlpha: false })
}
