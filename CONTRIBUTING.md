# Contribuindo

Que bom que você quer ajudar! Só um aviso antes: aqui mora o gerador, não a operação do seu clã. O logo, as fotos e o texto da missão ficam no navegador de quem usa, ou no JSON que vocês trocam entre si. Nada disso vem para o repositório.

Achou um problema ou teve uma ideia e não quer mexer no código? Abra uma [issue](https://github.com/flippelt/opord/issues) contando o que aconteceu, em qual folha e, se der, com um print.

## Preparando o ambiente

Você precisa do [Node.js 22](https://nodejs.org/) ou mais novo. Faça um fork, clone a sua cópia e rode:

```bash
git clone https://github.com/<seu-usuario>/opord.git
cd opord
npm install
npm run dev
```

O OPORD abre em <http://localhost:5173> e recarrega sozinho a cada mudança. Para rodar os testes:

```bash
npm test
```

## O que é bem-vindo

- Ajustes no visual da folha A4: faixas, carimbos, logo, exportação em PDF ou PNG
- Campos e folhas que façam sentido para milsim (sem copiar documento confidencial de verdade)
- Acessibilidade e melhorias no texto em português
- Testes (vitest), principalmente para DTG, classificação, mapas, carimbos e dossiês antigos

## O que não entra

- Missão, ORBAT, foto ou logo de um clã real
- Senhas, tokens ou mapas de servidor privado
- Dependências pesadas sem um bom motivo

## Antes de abrir o PR

Algumas coisas que costumam passar despercebidas:

- **Texto que vai para o papel** tem versão em português e em inglês, em `src/lib/i18n.ts`. Se você acrescentar um rótulo, coloque os dois.
- **Mudou o formato do dossiê?** Ajuste `migrateDossier`, em `src/defaults.ts`, para que um JSON antigo continue abrindo.
- **Mudou um campo ou uma folha?** A [wiki](https://github.com/flippelt/opord/wiki) explica cada um. Ela não recebe PR, então conte na descrição o que muda lá.

## Pull request

1. Use uma branch curta, como `feat/…` ou `fix/…`.
2. Rode `npm test` e `npm run build`. Os dois precisam passar. O CI roda os mesmos comandos e também um `npm audit`.
3. Conte o que mudou no documento: qual folha e qual campo.
4. Se o papel mudou de cara, mande um print de antes e depois.

## Licença

O código é MIT (veja o [LICENSE](LICENSE)). Ao enviar um PR, você concorda em licenciar a sua contribuição nos mesmos termos.
