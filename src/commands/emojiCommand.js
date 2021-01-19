const Discord = require("discord.js");

module.exports = {
name: "emoji",
aliases: ['emoji', 'emojo'],
cooldown: 3,
guildOnly: true,
async execute(client, message, args) {
   
  if (!args[0])
    return message.channel.send(
      `**${message.author.username}, a sintaxe correta é:** ` +
        "`" +
        "f!emoji nomedoemoji`"
    );
  let emoji = message.guild.emojis.cache.find(emoji => emoji.name === args[0]);

  if (!emoji) {
    message.channel.send(
      "`" + args[0] + "` **não é um emoji deste servidor.**"
    );
  } else if (emoji.animated === true) {
    message.channel.send(`<a:${args[0]}:${emoji.id}>`);
  } else {
    message.channel.send(`<:${args[0]}:${emoji.id}>`);
  }
}

}