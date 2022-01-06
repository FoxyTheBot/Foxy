<p align="center">
<img width="25%" src="https://bot.to/wp-content/uploads/2020/09/foxy_5f74b66cd07a4.png">
<br>
<h1 align="center">Foxy</h1>

 </p>
  <p align="center">
<a href="https://github.com/FoxyTheBot/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-AGPL%20v3-blue.svg?style=for-the-badge&logo=gnu&labelColor=black"></a>
</p>

## Quem sou eu?
Olá! Eu sou a Foxy, irei entreter seu servidor com meus comandos de economia, entretenimento, entre outros!

<br>

## Preparando ambiente

### Termos:
É vedado o uso da imagem e do nome da Foxy em instâncias privadas, o código publicado aqui é destinado aos contribuidores da Foxy, portanto nós da equipe de desenvolvimento da Foxy <strong>NÃO PRESTAMOS SUPORTE</strong> ao código publicado aqui.

De acordo com a licença você pode modificar o código fonte da Foxy mas você é obrigado a deixar o código público incluindo as modificações.
<br>

## Como executar a Foxy:

- Para rodar uma instância da Foxy você precisarar os seguintes softwares de terceiros: git, nodejs, npm. Consulte a documentação do seu Sistema Operacional para instalar.
- Baixe o código fonte da Foxy usando: git clone https://github.com/FoxyTheBot/Foxy
- Instale as dependências usando: npm install


Crie um arquivo de configuração para a Foxy chamado config.json e use o seguinte template:

```json
{
  "ownerId": "<Sua-ID>",
  "clientId": "<ID-Do-BOT>",
  "prefix": "<Prefixo-do-bot>",
  "token": "<Token-do-bot>",
  "mongouri": "<URI-do-MongoDB>",
  "dblauth": "<Auth-do-Discordbotlist>",

    "webhooks": {
        "guilds": "URL DO WEBHOOK",
        "suggestions": "URL DO WEBHOOK",
        "issues": "URL DO WEBHOOK"
    }
  }
```

### Configurando para primeiro uso:
- Registre os comandos de / utilizando: node register.js
- Pronto! A Foxy está pronta para ser executada! Use node . e digite /ping ou /help no seu servidor!
