# OPORD

[![CI](https://img.shields.io/github/actions/workflow/status/flippelt/opord/ci.yml?label=CI)](https://github.com/flippelt/opord/actions) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Briefing confidencial para milsim.

## 1. O que é

Sabe aquele briefing de operação que o clã passa no Discord antes da missão? O OPORD transforma isso num documento com cara de papel oficial, carimbado e confidencial. Foi feito pensando em Arma 3, Squad, Hell Let Loose e outros jogos do gênero. Roda direto no navegador, e tudo o que você escreve fica só no seu computador, sem enviar nada para lugar nenhum.

## 2. Quer só dar uma olhada?

Não precisa instalar nada. É só abrir a [demo](https://flippelt.github.io/opord/).

## 3. Montando o seu dossiê

Na [wiki](https://github.com/flippelt/opord/wiki) você encontra todas as folhas disponíveis, exemplos com imagens e um passo a passo de como usar o editor.

## 4. Como abrir

Você só precisa instalar o [Node.js 22](https://nodejs.org/) uma vez. Depois disso, basta dar dois cliques no arquivo do seu sistema. Deixe a janela que abrir rodando enquanto estiver usando, porque se fechar, o OPORD fecha junto.

| Sistema | Arquivo |
| --- | --- |
| Mac | `Abrir-OPORD.command` |
| Windows | `Abrir-OPORD.bat` |
| Linux | `abrir-opord.sh` |

Prefere o terminal? Rode `npm install` e depois `npm run abrir`.

## 5. O que fica salvo

Na primeira vez, o OPORD abre com uma operação de exemplo: a Serpente Negra, em Altis. Você pode editar em cima dela ou começar um dossiê do zero, só com a capa. Quando quiser levar a operação para outro computador (ou mandar para o pessoal do clã), exporte em PDF, em imagens ou em JSON.

## 6. Licença

MIT © 2026 Felipe Lippelt. O código está no arquivo [LICENSE](LICENSE).
