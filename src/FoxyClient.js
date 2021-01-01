const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const config = require('./json/config.json');

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.config = config;
const cmd = require('./json/resposta.json');
client.on("message", message => {
if (message.author.bot) {
    return;
}
responseObject = cmd;
if(responseObject[message.content]){
    message.channel.send(responseObject[message.content]);
}
})
client.on("guildCreate", async guild => {
    const webhookClient = new Discord.WebhookClient("WEBHOOKTOKEN", "WEBHOOK.TOKEN");
    const embed = new Discord.MessageEmbed()
          .setTitle('Logs de entrada e saída')
          .setDescription(`<:MeowPuffyMelt:776252845493977088> Fui adicionada no servidor: ${guild.name} / ${guild.id}`)
      webhookClient.send( {
          username: `Logs`,
          avatarURL: 'https://cdn.discordapp.com/attachments/766414535396425739/789255465125150732/sad.jpeg',
          embeds: [embed],
      });
    })
  client.on("guildDelete", async guild => {
    const webhookClient = new Discord.WebhookClient("WEBHOOKTOKEN", "WEBHOOK.TOKEN");
    const embed = new Discord.MessageEmbed()
        .setTitle('Logs de entrada e saída')
        .setDescription(`<:sad_cat_thumbs_up:768291053765525525> Fui removida do servidor: ${guild.name} / ${guild.id}`)
    webhookClient.send( {
        username: `Logs`,
        avatarURL: 'https://cdn.discordapp.com/attachments/766414535396425739/789255465125150732/sad.jpeg',
        embeds: [embed],
    });
  })
fs.readdir("./events", (err, files) => { 
    if(err) return console.error(`[Foxy Internal Error] - Ocorreu um erro ao ler o path ./events`);
    files.forEach(file => {
        const foxyevent = require(`./events/${file}`);
        const foxyeventname = file.split(".")[0];
        console.log(`[EVENTS] - Loaded event ${foxyeventname}.`);
        client.on(foxyeventname, foxyevent.bind(null, client));
    });
});

fs.readdir('./commands', (err,files) => {
    console.log('[COMMANDS]', `Loaded ${files.length} commands`)
      if(err) console.error(err)
      let jsfiles = files.filter(file => file.split(".").pop() === 'js')
      if(!jsfiles || jsfiles.legnth <= 0) console.log(`Comandos não encontrados`)
      jsfiles.forEach((file,i) => {
        let props = require(`./commands/${file}`)
          if(props.run && props.help.name) {
              client.commands.set(props.help.name, props)
              if(props.help.aliases && Array.isArray(props.help.aliases)) {
                  props.help.aliases.forEach(alias => {
                      client.aliases.set(alias, props.help.name)
                  })
              }
          } else {
              console.log(`Comando '${props.help.name}' com erro!`)
          }
        })
    })
client.on("message" ,message => {
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))

    if (message.content.indexOf(client.config.prefix) !== 0) return;
    if (!cmd) return;
    cmd.run(client, message, args);
})
client.login(config.token);