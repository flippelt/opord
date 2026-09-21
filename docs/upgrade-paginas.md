# Upgrade: títulos por folha e páginas em branco

Pedido do clã: poder **renomear o título de cada folha** e **inserir páginas
em branco** no dossiê (croqui, lista extra, anexo que o OPORD não cobre).

Status: **planejado**. Não implementado nesta versão.

## Problema

Hoje o título vem do tipo do documento (`OPORD`, `COMUNICADO Nº 12/2026`,
`SITREP`…). A ordem das folhas é fixa no preview. Não há folha vazia com
classificação e marca d’água para o operador preencher à mão ou colar um
mapa.

## Recorte

### 1. Título customizável por folha

Campo opcional no dossiê:

```ts
titles?: Partial<Record<PageId, string>>
```

- Vazio = título padrão de hoje
- Editor: um campo “Título desta folha” para cada página ligada
- Capa: título grande + linha menor (hoje “Operação / Assunto”)
- OPORD: substitui `OPORD 23-09-04 — OP. SERPENTE NEGRA` se preenchido
- Demais folhas: substitui o H1 (SITREP, AAR, ORBAT, CASEVAC, HVT, comunicado)

Não inventar um CMS. Um string por folha basta.

### 2. Páginas em branco

```ts
blanks: {
  id: string
  title: string      // ex. "ANEXO C — CROQUI DO PZ"
  heading: string    // subtítulo opcional
  body: string       // texto opcional; vazio = só o papel
  lined: boolean     // pautado para anotar na mesa
}[]
```

Visual: A4 com faixas de classificação, furos, marca d’água, letterhead do
clã, título, corpo vazio ou linhas. Exporta PDF/PNG como as outras.

No editor: **+ Página em branco**, remover, editar título. Várias no mesmo
dossiê.

### 3. Ordem da pilha

Para a página em branco cair *entre* o OPORD e a intel, a ordem deixa de ser
hardcoded.

```ts
stack: Array<{ kind: PageId | 'blank'; id?: string }>
```

- Default: a ordem atual (capa → comunicado → OPORD → … → intel), com os
  blanks no fim se a stack antiga não existir
- Editor: setas sobe/desce nas páginas ligadas
- Migração: dossiês velhos ganham `stack` derivada de `pages` + `blanks`

## Fora deste recorte

- Editor WYSIWYG no papel
- Folhas de tamanho diferente de A4
- Colar PDF de terceiro como fundo

## Como saber que acabou

- Renomear “OPORD” para “FRAGO 04” reflete na folha e no PDF
- Inserir uma página “ANEXO C”, pautada, entre o OPORD e a intel
- JSON antigo continua abrindo
- Lançadores de duplo clique não mudam
