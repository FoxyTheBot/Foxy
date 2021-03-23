module.exports = async (client) => {
  console.info(`\x1b[37m\x1b[42mSUCCESS\x1b[0m: Foxy is ready! Logged as: ${client.user.tag}`);
  
  const status = [
    { name: `❓ | Se você precisa de ajuda use ${client.config.prefix}help`, type: 'WATCHING' },
    { name: `💻 | Quer encontrar meus comandos use: ${client.config.prefix}commands`, type: 5 },
    { name: '🐦 | Me siga no Twitter: @FoxyDiscordBot', type: 'STREAMING', url: 'https://www.twitch.tv/wing4merbr' },
    { name: '💖 | Fui criada pelo WinG4merBR#5995', type: 'LISTENING' },
    { name: `😍 | Me adicione usando ${client.config.prefix}invite`, type: 'WATCHING' },
    { name: `✨ | Entre no meu servidor de suporte usando ${client.config.prefix}help`, type: 'STREAMING', url: 'https://www.twitch.tv/wing4merbr' },
    { name: `🐛 | Se você encontrou um bug use ${client.config.prefix}report para reportar falhas`, type: 'PLAYING' },
    { name: '🍰 | Minha comida preferida é bolo 💖', type: 5 },
    { name: `😍 | Espalhando alegria e felicidade em ${client.guilds.cache.size} Servidores! :3`, type: 'WATCHING' },
    { name: "😍 | Obrigada a Luxanna#5757 por me ajudar a ser quem sou hoje ❤", type: "LISTENING"}
  ];

  setInterval(() => {
    const randomStatus = status[Math.floor(Math.random() * status.length)];
    client.user.setPresence({ activity: randomStatus });
  }, 5000);

  const profilePics = [
    'https://cdn.discordapp.com/attachments/776930851753426945/811265067227545630/foxy_cake.png',
    'https://cdn.discordapp.com/attachments/776930851753426945/811265068741165056/foxybis.png',
    'https://cdn.discordapp.com/attachments/776930851753426945/811265070221885500/foxy_vlogs.png',
    'https://cdn.discordapp.com/attachments/776930851753426945/811265109728034846/Foxy.png',
  ];

  setInterval(() => {
    const x = profilePics[Math.floor(Math.random() * profilePics.length)];
    client.user.setAvatar(x);
  }, 10800000);
};
