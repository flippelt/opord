# OPORD

Gerador web de **ordens de operações** e briefings classificados para clãs de
milsim (Arma 3, Squad e afins). O resultado é um dossiê em papel A4 — capa com
folha de classificação, OPORD no formato SMEAC e anexo de foto intel — com
selos, marca d’água e identidade do clã.

Tudo corre **no navegador**. Nada é enviado a servidor.

## Uso

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. O primeiro acesso carrega um exemplo (Operação
SERPENTE NEGRA, Altis) para o visual já nascer preenchido. Use **Dossiê em
branco** para começar do zero, ou edite o exemplo.

[<img src="docs/screenshots/overview.jpg" width="720" alt="Capa classificada da operação exemplo">](docs/screenshots/overview.jpg)

### Identidade do clã

- **Selo** — capa, cabeçalho do OPORD e bloco de assinatura.
- **Distintivo / patch** — canto direito do OPORD.

PNG com fundo transparente funciona melhor no selo.

### Campos militares

Origem (FROM), destino (TO), info (CC), precedência (FLASH / IMEDIATO /
PRIORIDADE / ROTINA), DTG Zulu (`221845ZSEP26`), hora-H, AO, grid, carta,
terreno, missão no formato *quem / o quê / quando / onde / para quê*,
execução, logística, redes, desafio/senha, ROE.

Classificação no padrão brasileiro com equivalente NATO:

| Documento | NATO |
| --- | --- |
| OSTENSIVO | UNCLASSIFIED |
| RESERVADO | RESTRICTED |
| CONFIDENCIAL | CONFIDENTIAL |
| SECRETO | SECRET |
| ULTRA-SECRETO | TOP SECRET |

Caveats (EYES ONLY, NOFORN, ORCON…) entram na faixa de classificação.

### Selos e marca d’água

A marca d’água clássica **CONFIDENCIAL** (ou o texto da classificação) pode ser:

- palavra diagonal grande
- selo oval no centro
- mosaico repetido
- diagonal + selo (padrão)

Por cima, selos de tinta ligáveis: CONFIDENCIAL, EYES ONLY, CÓPIA, DESTROY AFTER
ACTION, WORKING PAPERS, ORCON, VERIFICADO. Cada um cai numa página (capa, OPORD,
intel ou todas).

### Exportar

- **PDF** — as páginas A4 visíveis.
- **PNG** — ZIP com uma imagem por página.
- **Imprimir** — CSS de impressão A4 (útil também como “Salvar PDF” do sistema).
- **JSON** — backup / troca de dossiê entre máquinas do clã.

O dossiê também fica salvo no IndexedDB do navegador.

## Scripts

```bash
npm test      # vitest
npm run build
```

## Licença

MIT. O exemplo no primeiro acesso é ficção de milsim; não representa unidade
real.
