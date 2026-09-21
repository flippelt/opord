# OPORD

[![CI](https://img.shields.io/github/actions/workflow/status/flippelt/opord/ci.yml?label=CI)](https://github.com/flippelt/opord/actions) [![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Gerador web de **briefings classificados** para **clãs de jogos de simulação militar** — Arma 3, Squad, Hell Let Loose e afins. O clã monta o dossiê da operação (OPORD, comunicado, intel, HVT, CASEVAC…) com visual de documento controlado e exporta PDF ou imagem para o Discord, o briefing da sala ou o print na TV.

Feito para **clã milsim**, não para mesa de RPG. Tudo corre **no navegador**. Nada vai para servidor — o plano da operação fica na máquina.

**Demo:** https://flippelt.github.io/opord/

[<img src="docs/screenshots/overview.jpg" width="720" alt="Estação de operações com a capa classificada">](docs/screenshots/overview.jpg)

## Para o clã

- Identidade: nome, lema, **selo** (capa, cabeçalho, assinatura) e **patch**
- Classificação brasileira com equivalente NATO (OSTENSIVO → ULTRA-SECRETO) e caveats (EYES ONLY, NOFORN, ORCON…)
- Jargão de emprego: origem/destino, DTG Zulu, hora-H, AO, grid, ROE, redes, desafio/senha
- Marca d’água grande na diagonal; selos de tinta opcionais
- Exportar **PDF**, **PNG** (ZIP), imprimir A4 ou backup **JSON** entre PCs do clã

## Folhas do dossiê

Ligue o que a operação precisa em **Páginas**.

| Folha | Uso |
| --- | --- |
| Capa | Folha de classificação, selo do clã, aviso de manuseio |
| Comunicado / convocação / boletim | Ofício ao efetivo; op night com servidor, mods, slotting, TS |
| OPORD | SMEAC: situação, missão, execução, logística, comando |
| SITREP | Inimigo, amigos, ACE, pendências, intenção |
| AAR | O que aconteceu, o que funcionou, o que falhou, lições, BDA |
| ORBAT | Organização de tarefa |
| HVT | Cartão de alvo (retrato, alias, orientação CAPTURE/KILL) |
| CASEVAC | Pedido MEDEVAC em 9 linhas NATO |
| Intel | Placas de foto (UAV, SAT, RECON, HUMINT) |

### Capa

[<img src="docs/screenshots/capa.jpg" width="480" alt="Capa CONFIDENCIAL">](docs/screenshots/capa.jpg)

### Comunicado de emprego

[<img src="docs/screenshots/notice.jpg" width="480" alt="Comunicado interno">](docs/screenshots/notice.jpg)

### OPORD

[<img src="docs/screenshots/opord-1.jpg" width="480" alt="OPORD página 1">](docs/screenshots/opord-1.jpg)
[<img src="docs/screenshots/opord-2.jpg" width="480" alt="OPORD página 2">](docs/screenshots/opord-2.jpg)

### SITREP, AAR, ORBAT

[<img src="docs/screenshots/sitrep.jpg" width="320" alt="SITREP">](docs/screenshots/sitrep.jpg)
[<img src="docs/screenshots/aar.jpg" width="320" alt="AAR">](docs/screenshots/aar.jpg)
[<img src="docs/screenshots/orbat.jpg" width="320" alt="ORBAT">](docs/screenshots/orbat.jpg)

### HVT e CASEVAC

[<img src="docs/screenshots/hvt-1.jpg" width="320" alt="Cartão HVT">](docs/screenshots/hvt-1.jpg)
[<img src="docs/screenshots/casevac.jpg" width="320" alt="CASEVAC 9 linhas">](docs/screenshots/casevac.jpg)

### Anexo de intel

[<img src="docs/screenshots/intel.jpg" width="480" alt="Anexo de foto intel">](docs/screenshots/intel.jpg)

## Classificação

| Documento | NATO |
| --- | --- |
| OSTENSIVO | UNCLASSIFIED |
| RESERVADO | RESTRICTED |
| CONFIDENCIAL | CONFIDENTIAL |
| SECRETO | SECRET |
| ULTRA-SECRETO | TOP SECRET |

A capa muda de cor com o nível. A marca d’água usa o texto da classificação (ou o que você escrever).

## Abrir sem terminal (duplo clique)

Na primeira vez instala o [Node.js 22 LTS](https://nodejs.org/) (o instalador
oficial). Depois:

| Sistema | Arquivo |
| --- | --- |
| macOS | `Abrir-OPORD.command` (Finder; se bloquear: clique direito → Abrir) |
| Windows | `Abrir-OPORD.bat` |
| Linux | `abrir-opord.sh` |

O lançador instala as dependências na primeira execução, sobe o app e abre o
navegador em `http://127.0.0.1:5173`. Deixe a janela aberta; feche-a para
encerrar.

## Uso no terminal

```bash
npm install
npm run abrir    # ou: npm run dev
npm test
npm run build
```

O primeiro acesso abre o exemplo **Operação SERPENTE NEGRA** (Altis). Use
**Dossiê em branco** para a operação real do clã, ou edite o exemplo. O dossiê
fica no IndexedDB do navegador.

## Licença

[MIT](LICENSE). Copyright (c) 2026 Felipe Lippelt. O exemplo do primeiro acesso
é ficção de milsim; não representa unidade real.

## Contribuindo

Veja [CONTRIBUTING.md](CONTRIBUTING.md). Código por pull request; a `main` é
protegida. Missão real do clã não entra no repositório.

Próximo recorte (títulos por folha e páginas em branco):
[docs/upgrade-paginas.md](docs/upgrade-paginas.md).
