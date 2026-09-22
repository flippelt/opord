# Contribuindo

Obrigado pelo interesse. Aqui mora o gerador, não a operação do seu clã.
Logo, fotos e o texto da missão ficam no navegador de quem usa, ou num JSON
que vocês guardam entre si.

## Licença

O código é **MIT**. Veja [LICENSE](LICENSE). Ao enviar um PR, você concorda em
licenciar a contribuição nos mesmos termos.

## Antes de começar

- Node.js **22+**
- Fork, uma branch sua, e um pull request

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

- Correção de visual no documento A4 (faixas, carimbos, logo, export PDF/PNG)
- Campos e folhas úteis para milsim (sem copiar documento classificado real)
- Acessibilidade e textos em português
- Testes (vitest) para DTG, classificação, migração de dossiê

## O que não entra

- Missão, ORBAT, foto ou logo de clã real
- Segredos, tokens, mapas de servidor privado
- Dependências pesadas sem necessidade clara

## Pull request

1. Branch curta (`feat/…`, `fix/…`)
2. `npm test` e `npm run build` verdes
3. Descreva o que mudou no documento (qual folha, qual campo)
4. Uma imagem, se o papel mudou de cara

O plano de deixar os títulos das folhas editáveis, e de incluir páginas em
branco, está em [docs/upgrade-paginas.md](docs/upgrade-paginas.md).
