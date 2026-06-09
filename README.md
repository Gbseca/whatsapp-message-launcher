# WhatsApp Message Launcher

Ferramenta para preparar mensagens personalizadas e gerar links de envio pelo WhatsApp a partir de uma lista de contatos. O projeto foi pensado para operacoes comerciais simples, em que a equipe precisa ganhar velocidade sem automatizar disparos indevidos.

## Funcionalidades

- Importacao de contatos em texto.
- Template de mensagem com substituicao por nome.
- Geracao de links para WhatsApp Web ou aplicativo.
- Marcacao de contatos ja processados.
- Formatacao visual de telefones.
- Interface responsiva para uso rapido durante atendimento.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Express
- Lucide React

## Como Rodar

```bash
npm install
npm run dev
```

Se usar recursos com IA, configure:

```bash
GEMINI_API_KEY=
```

## Formato De Entrada

Cada linha deve seguir o formato:

```text
Nome;Telefone
Maria Silva;5521999999999
```

## Observacoes

O projeto gera atalhos de envio manual. Ele nao faz disparo automatico em massa, o que reduz risco operacional e deixa o uso mais adequado para rotina comercial.

