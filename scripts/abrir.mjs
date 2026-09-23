#!/usr/bin/env node
/**
 * Sobe o OPORD no navegador. Usado pelos lançadores de duplo clique
 * (macOS / Linux / Windows). Não precisa saber npm.
 */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { stdin as stdinFd, stdout as stdoutFd } from 'node:process'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'
import { escolherPorta, HOST, nodeMajor } from './abrir-lib.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

process.chdir(ROOT)

function log(msg) {
  process.stdout.write(`${msg}\n`)
}

function abrirNavegador(url) {
  const plat = process.platform
  if (plat === 'darwin') spawn('open', [url], { detached: true, stdio: 'ignore' })
  else if (plat === 'win32') spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' })
  else spawn('xdg-open', [url], { detached: true, stdio: 'ignore' })
}

function npmCmd() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm'
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: ROOT,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${cmd} saiu com código ${code}`))
    })
  })
}

async function esperarHttp(url, ms = 30000) {
  const t0 = Date.now()
  while (Date.now() - t0 < ms) {
    try {
      const res = await fetch(url)
      if (res.ok) return
    } catch {
      /* ainda subindo */
    }
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error('O servidor não respondeu a tempo.')
}

function pausar(mensagem) {
  if (!stdinFd.isTTY) return Promise.resolve()
  const rl = createInterface({ input: stdinFd, output: stdoutFd })
  return new Promise((resolve) => {
    rl.question(`${mensagem}\n`, () => {
      rl.close()
      resolve()
    })
  })
}

async function main() {
  log('')
  log('  OPORD — briefing confidencial para clãs de milsim')
  log('  ------------------------------------------------')
  log('')

  if (nodeMajor() < 22) {
    throw new Error(
      `Node.js 22 ou superior é necessário (encontrado ${process.versions.node}).\n` +
        '  Instale em https://nodejs.org/  — escolha a versão LTS 22.',
    )
  }

  if (!existsSync(join(ROOT, 'node_modules'))) {
    log('  Primeira vez: instalando dependências (pode levar um minuto)…')
    log('')
    await run(npmCmd(), ['install'])
    log('')
  }

  const port = await escolherPorta()
  const url = `http://${HOST}:${port}/`
  log(`  Subindo em ${url}`)
  log('  Deixe esta janela aberta. Feche-a para encerrar o OPORD.')
  log('')

  const vite = spawn(npmCmd(), ['run', 'dev', '--', '--host', HOST, '--port', String(port)], {
    cwd: ROOT,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  let fechando = false
  const parar = () => {
    if (fechando) return
    fechando = true
    vite.kill('SIGTERM')
  }
  process.on('SIGINT', parar)
  process.on('SIGTERM', parar)

  await esperarHttp(url)
  abrirNavegador(url)

  const code = await new Promise((resolve) => {
    vite.on('exit', (c) => resolve(c ?? 0))
  })
  if (code !== 0 && !fechando) {
    throw new Error(`O servidor encerrou com código ${code}.`)
  }
}

main().catch(async (err) => {
  log('')
  log(`  ERRO: ${err instanceof Error ? err.message : String(err)}`)
  log('')
  await pausar('  — Pressione Enter para fechar —')
  process.exit(1)
})
