# Contribuindo

Obrigado pelo interesse. Este repositório é o **motor** do gerador de briefing
para clãs de milsim. Conteúdo de operação real (OPORD da sua unidade, fotos de
intel, selo do clã) **não entra** em pull request — fica no navegador de quem
usa, ou num JSON privado.

## Licença

O código é **MIT**. Veja [LICENSE](LICENSE). Ao enviar um PR, você concorda em
licenciar a contribuição nos mesmos termos.

## Antes de começar

- Node.js **22+**
- Fork + branch a partir de `main`
- Código entra por **pull request** (a `main` é protegida)

```bash
git clone https://github.com/<seu-usuario>/opord.git
cd opord
npm install
npm run dev      # http://localhost:5173
npm test
```

Quem não quiser terminal: os lançadores na raiz (`Abrir-OPORD.command` no
macOS, `abrir-opord.sh` no Linux, `Abrir-OPORD.bat` no Windows).

## O que é bem-vindo

- Correção de visual no documento A4 (faixas, selos, export PDF/PNG)
- Campos e folhas úteis para milsim (sem copiar documento classificado real)
- Acessibilidade e textos em português
- Testes (vitest) para DTG, classificação, migração de dossiê

## O que não entra

- Missão, ORBAT, foto ou selo de clã real
- Segredos, tokens, mapas de servidor privado
- Dependências pesadas sem necessidade clara

## Pull request

1. Branch curta (`feat/…`, `fix/…`)
2. `npm test` e `npm run build` verdes
3. Descreva o que mudou no documento (qual folha, qual campo)
4. Screenshots se o visual do papel mudou

O dono faz o merge. Não é preciso clonar o estilo de RPG de mesa — o foco daqui
é clã de simulação militar.

## Roadmap

O próximo recorte de produto está em [docs/upgrade-paginas.md](docs/upgrade-paginas.md)
(títulos por folha e páginas em branco).
