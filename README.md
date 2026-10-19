# Quem fez isso?

Jogo de perguntas sobre atitudes polêmicas de políticos brasileiros. Você lê uma atitude sem saber de quem é e aponta o culpado: **Lula**, **Bolsonaro** (Jair ou Flávio) ou **os dois lados**.

A ideia é simples: todo mundo lembra das polêmicas do adversário e esquece as do próprio candidato. No fim da rodada, o jogo mostra o que você só enxerga no político dos outros.

## Como funciona

- Cada rodada tem 10 atitudes, sorteadas entre as que você ainda não viu.
- Acerto vale 100 pontos (150 quando a resposta é "os dois lados"), com bônus por sequência.
- Depois de responder, o jogo revela quem foi, o contexto e as fontes.
- No fim, você ganha uma patente, vê o acerto por lado e uma frase sobre o seu viés. Dá para compartilhar o resultado estilo Wordle.
- Atalhos de teclado: `L`, `B` e `A` para responder, `Enter` para avançar.

## Dados

As atitudes ficam em `src/data/quotes/*.json`, um arquivo por autor (`lula`, `jair`, `flavio` e `ambos`). Cada item segue o tipo `Quote` em `src/data/types.ts`:

- `text`: a atitude, em terceira pessoa e sem pistas sobre o autor.
- `context`: onde, quando e o que aconteceu depois. Aparece só após a resposta.
- `sources`: uma ou mais fontes de imprensa. Itens de `ambos` têm pelo menos uma por lado.
- `difficulty`: 2 (médio) ou 3 (difícil). Itens óbvios demais ficam de fora.

Só entra o que tem fonte verificável. Frases desmentidas por agências de checagem ou de autoria duvidosa não entram.

## Rodando

```bash
pnpm install
pnpm dev
```

Abra http://localhost:3000.

```bash
pnpm test   # testes da lógica do jogo
pnpm lint
pnpm build
```

Variável opcional: `NEXT_PUBLIC_SITE_URL` define a URL usada no texto de compartilhamento.

## Estrutura

- `src/game/`: lógica pura do jogo (sorteio da rodada, pontuação, reducer, resumo, texto de compartilhamento, persistência) com testes em Vitest.
- `src/components/game/`: telas da rodada e do resultado.
- `src/components/ui/`: peças visuais reutilizáveis (botão, carimbo, fita, etc.).
- `src/app/globals.css`: todos os tokens de cor, fonte e sombra do tema.

## Stack

Next.js 16, React 19, Tailwind CSS 4, Motion e Vitest.
