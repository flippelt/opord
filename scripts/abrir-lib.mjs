import { createServer } from 'node:net'

export const HOST = '127.0.0.1'
export const PREFERRED_PORT = 5173

export function nodeMajor(version = process.versions.node) {
  return Number.parseInt(String(version).split('.')[0] ?? '0', 10)
}

export function portLivre(port, host = HOST) {
  return new Promise((resolve) => {
    const server = createServer()
    server.once('error', () => resolve(false))
    server.listen(port, host, () => {
      server.close(() => resolve(true))
    })
  })
}

export async function escolherPorta(inicio = PREFERRED_PORT, tentativas = 8) {
  for (let p = inicio; p < inicio + tentativas; p++) {
    if (await portLivre(p)) return p
  }
  throw new Error(`Nenhuma porta livre entre ${inicio} e ${inicio + tentativas - 1}.`)
}
