# WhatsApp Message Launcher | Mensagens personalizadas

Uma ferramenta simples para preparar contatos de atendimento ou reativação. Você cola uma lista de nomes e telefones, escreve a mensagem e recebe um atalho personalizado para cada pessoa. A interface permite marcar os contatos já processados para acompanhar a fila.

## O que você encontra

- Leitura de contatos no formato Nome;Telefone.
- Personalização da mensagem com a variável {nome}.
- Normalização de telefones brasileiros e geração de links de contato.
- Marcação dos contatos processados durante a sessão.

## Tecnologias

React, TypeScript, Vite, Tailwind CSS e Lucide React.

## Executar localmente

```bash
npm install
npm run dev
```

A interface usa a porta `3000`. Para conferir o TypeScript e gerar a versão de publicação:

```bash
npm run lint
npm run build
```

## Lista de contatos

Use uma linha por contato, no formato `Nome;Telefone`. A mensagem aceita `{nome}` para personalização. Inclua o código do país quando necessário.

## Funcionamento

O projeto prepara links para envio manual. A marcação de contatos é mantida no estado da interface durante a sessão.
