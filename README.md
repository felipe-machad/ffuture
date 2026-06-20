# FFuture.IA — Site institucional

Site **estático** (HTML + CSS + JS puro, sem build) da **FFuture.IA** — empresa de
Inteligência Artificial, automação e integração de sistemas.

> A pasta continua se chamando `future-ai/` apenas por convenção de arquivos; a marca
> exibida em todo o site é **FFuture.IA**.

## Estrutura de arquivos

```
future-ai/
├── index.html        # Página única com todas as seções
├── styles.css        # Estilos (paleta azul marinho / acentos elétricos)
├── script.js         # Interações + fundo de rede neural animada (canvas)
├── favicon.svg       # Favicon (monograma "FF")
├── og-image.png      # Imagem de compartilhamento (1200x630)
├── Dockerfile        # Imagem nginx para deploy (porta 80)
├── nginx.conf        # Configuração do nginx (gzip + cache de assets)
├── .dockerignore     # Arquivos ignorados na imagem Docker
├── .gitignore        # Arquivos ignorados no Git
└── README.md         # Este arquivo
```

## Seções

1. **Hero** — "Construindo o futuro através da Inteligência Artificial" + slogan (Forge. Focus. Forward.) + fundo de rede neural animada
2. **Trust strip** — canais e sistemas integrados
3. **Parceria** — a essência da marca: parceria estratégica de crescimento (sem foco em "agentes")
4. **Nosso método** — os 3 atos **FORGE · FOCUS · FORWARD** (Construir → Direcionar → Avançar), conectados à animação de abertura
5. **O que fazemos** — 6 cards (Implementação de IA, Automação, Integração, Dashboards & BI, Soluções sob medida, Consultoria)
6. **Demo** — slot de mídia 16:9 (trocável)
7. **Sobre** — quem somos + **Missão** + **Visão**
8. **Para quem** — setores atendidos
9. **CTA** com a assinatura da marca (Forge. Focus. Forward.)
10. **Contato** — dados + formulário que abre o WhatsApp
11. **Rodapé** com a mini-animação da marca

> **Conceito:** a sequência da animação (Forge → Focus → Forward → FFuture.IA) é a espinha
> narrativa da marca — não é só efeito de abertura, é o método de trabalho.

## Itens marcados como `placeholder` (revisar antes de publicar)

- Frase do trust strip e logos de integração (trocar por logos reais quando houver)
- E-mail de contato: `contato@ffuture.ia`
- WhatsApp: `+55 51 99370-6131` (confirmar)
- Links de redes sociais (LinkedIn / Instagram)
- Domínio nas meta tags (`ffuture.ia`) e imagem `og-image.png`

> Os textos de Hero, Sobre, Missão, Visão e "O que fazemos" já usam o conteúdo real.

## Acessibilidade & performance

- HTML semântico, landmarks, `skip-link`, foco visível e `aria-*` no menu.
- A animação do hero respeita `prefers-reduced-motion` e pausa quando o hero sai da tela.

---

## Personalização rápida

### Animação de abertura (hero)
Ao carregar, roda a sequência **FORGE → FOCUS → FORWARD → FFUTURE** e o **“.IA” cai de cima e
se encaixa** à direita, formando **FFUTURE.IA**. É **pulável** (botão “Pular”, clique ou tecla
Esc/Enter) e respeita `prefers-reduced-motion` (mostra direto o estado final). O markup fica em
`#intro` (`index.html`); os tempos/efeitos no CSS (`.intro*`) e a orquestração/skip no
`script.js`. No rodapé há uma versão mini que se monta ao entrar na viewport (`#footerAnim`).

### Slot de demo (vídeo / GIF / iframe)
Na seção **Demonstração** (`#demo`) há um placeholder 16:9. Para colocar uma demo real,
substitua o bloco `<div class="media__frame">…</div>` por **uma** das linhas comentadas acima:

- Vídeo: `<video class="media__el" src="demo.mp4" poster="demo-poster.jpg" controls playsinline></video>`
- GIF: `<img class="media__el" src="demo.gif" alt="Demonstração" />`
- Iframe: `<iframe class="media__el" src="https://SEU-LINK" title="Demo" allowfullscreen loading="lazy"></iframe>`

### OG image
`og-image.png` (1200×630) já está na raiz; as metas OpenGraph/Twitter apontam para
`https://ffuture.ia/og-image.png`. Ajuste o domínio ao publicar.

---

## Deploy via GitHub + EasyPanel (Dockerfile)

O deploy é feito por **Dockerfile a partir de um repositório no GitHub**. O `Dockerfile`
sobe um nginx servindo os arquivos estáticos na **porta 80**.

### 1. Criar o repositório no GitHub

Crie um repositório novo (ex.: `ffuture-ia`) em https://github.com/new
(pode ser público ou privado).

### 2. Enviar os arquivos (push)

Dentro da pasta `future-ai/`:

```bash
git init
git add .
git commit -m "FFuture.IA — site estático"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/ffuture-ia.git
git push -u origin main
```

### 3. Criar o App no EasyPanel

1. No EasyPanel, abra seu **Project** → **+ Service → App**.
2. Em **Source**, escolha **GitHub** e selecione o repositório `ffuture-ia`
   (branch `main`). Conecte sua conta do GitHub se ainda não tiver feito.
3. Em **Build**, selecione **Dockerfile** (o EasyPanel detecta o `Dockerfile` na raiz).
   - Caminho do Dockerfile: `Dockerfile` (raiz do repo).
4. Em **Deploy / Ports**, exponha a **porta 80** (definida no Dockerfile).
5. Clique em **Deploy**. O EasyPanel faz o build da imagem e sobe o container.

### 4. Domínio + HTTPS

1. Na aba **Domains** do serviço, adicione seu domínio (ex.: `ffuture.ia`).
2. Aponte o DNS do domínio para o IP da sua VPS (registro A).
3. Ative o **HTTPS (Let's Encrypt)** — o EasyPanel emite o certificado automaticamente.

### Atualizações futuras

Cada novo `git push` na branch `main` pode disparar um novo build/deploy
(ative o **Auto Deploy** no serviço, se desejar).

### Teste local (opcional)

```bash
# servir sem Docker
python3 -m http.server 8080
# ou testar a imagem Docker localmente
docker build -t ffuture-ia .
docker run --rm -p 8080:80 ffuture-ia
# abra http://localhost:8080
```

---

Feito com HTML, CSS e JavaScript puro — sem dependências, fácil de manter e hospedar.
