# FFUTURE.IA — v3

Versão **v3** do site da FFuture.IA — uma **mistura**: o conteúdo da FFuture com o
**formato/estética** do stupidbutton.club (preto + tipografia monoespaçada, minimalista,
cards, lista numerada, marquee), **sem foco em venda**, com acento cyan/azul da marca.

> Site **estático** (HTML + CSS + JS puro, sem build). A versão anterior (navy) segue
> intacta em `../future-ai`.

## Estrutura
```
future-ai-v3/
├── index.html      # página única
├── styles.css      # estética preta + monoespaçada (JetBrains Mono)
├── script.js       # abertura animada + cursor + rede no hero + reveal
├── favicon.svg / og-image.png
├── Dockerfile / nginx.conf / .dockerignore / .gitignore
└── README.md
```

## Seções
1. **Abertura** — a mesma animação (F → FORGE → FOCUS → FORWARD → FFUTURE.IA).
2. **Barra fixa** (estilo "offer bar") — marca + nav + indicador em bolinhas + CTA.
3. **Hero** — card central "O futuro, em produção." + CTAs + linha de stats.
4. **Marquee de logos** (parceiros/ferramentas) — loop infinito sem cortes, pausa no hover, slots `<img>` trocáveis.
5. **Método** — Forge · Focus · Forward (3 atos).
6. **O que fazemos** — lista numerada **01–08**.
7. **Essência** — frase grande de parceria.
8. **Contato/CTA** + **Rodapé** minimalista.

## Itens a revisar (ver bloco CHECKLIST no fim do index.html)
Domínio nas metas, og-image, e-mail (exemplo) — o número fica só no link do botão (wa.me), não
aparece no site —, redes sociais, e os **logos do marquee**: troque cada `<img>` dentro de
`.marq__group` por logos seus (parceiros ou ferramentas; ex.: `src="logos/totvs.svg"`).

## Deploy via GitHub + EasyPanel (Dockerfile)
Mesmo fluxo das outras versões: `git push` → no EasyPanel **App → Build: Dockerfile →
porta 80 → Domains + HTTPS**. Teste local: `python3 -m http.server 8080`.
