# OPORD

[![CI](https://img.shields.io/github/actions/workflow/status/flippelt/opord/ci.yml?label=CI)](https://github.com/flippelt/opord/actions) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Monta o briefing da operação do clã com cara de documento controlado. Você preenche, coloca o logo e as fotos, e leva um PDF ou uma imagem para o Discord, a sala ou a TV.

É para clãs de Arma 3, Squad, Hell Let Loose e jogos do mesmo tipo. Abre no navegador, na sua máquina. O que você escrever fica aí.

**Para ver sem instalar:** https://flippelt.github.io/opord/

**Para montar o dossiê:** a [wiki](https://github.com/flippelt/opord/wiki) tem as folhas, as imagens e o passo a passo do editor.

## Como abrir

Se você não mexe em terminal, instale o [Node.js 22](https://nodejs.org/) uma vez (o instalador do site) e dê dois cliques:

| Onde | Arquivo |
| --- | --- |
| Mac | `Abrir-OPORD.command` |
| Windows | `Abrir-OPORD.bat` |
| Linux | `abrir-opord.sh` |

No Mac, se o sistema recusar na primeira vez, clique com o botão direito e escolha Abrir. A janela que aparecer instala o que falta, abre o navegador e precisa ficar aberta enquanto você usa. Fechar ela encerra o programa.

Quem prefere terminal:

```bash
npm install
npm run abrir
```

A primeira vez mostra a operação de exemplo **Serpente Negra**, em Altis. Dá para editar por cima ou começar um **novo dossiê**, que abre só com a capa. O trabalho fica salvo neste navegador. PDF, imagens e um arquivo JSON servem para levar a operação para outro computador do clã.

## Licença

MIT © 2026 Felipe Lippelt
