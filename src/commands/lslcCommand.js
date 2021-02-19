module.exports = {
  name: "lslc",
  aliases: ['lsx', 'coins', 'lslc'],
  cooldown: 1,
  guildOnly: true,
  ownerOnly: true,
  async execute(client, message, args) {
    const db = require('quick.db')
    let user = message.mentions.members.first() || message.author;
    if (!user) return message.reply("Tente: f!lsx <add/remove> 500 <menção>")
    let bal = await db.fetch(`coins_${user.id}`)

    switch (args[0]) {
      case "remove_coins":

        if (isNaN(args[1])) return;
        db.subtract(`coins_${user.id}`, args[1])

        message.channel.send(`Removido ${args[1]} FoxCoins de ${user} agora ele(a) possui ${bal} FoxCoins`)
        break
      case "add_coins":
        db.add(`coins_${user.id}`, args[1])

        message.channel.send(`Foram adicionados ${args[1]} FoxCoins na conta de ${user} agora ele(a) possui ${bal} FoxCoins`)
        break
      case "reset_background":
        db.set(`background_${user.id}`, 'default_background.png')
        message.channel.send(`O Background de ${user} foi redefinido!`)

        break

      case "set_background":
        db.set(`background_${user.id}`, `${args[1]}`)
        message.channel.send(`O arquivo ${args[1]} foi setado no perfil de ${user}`)
        break

      default:
        message.channel.send("Digite um valor!")
    }
  }
}