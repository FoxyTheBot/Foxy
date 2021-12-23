const Canvas = require('canvas');
const Discord = require('discord.js');
module.exports = {
    name: "namorada",
    aliases: ['minhanamorada', 'namorada', 'girlfriend', 'mygirlfriend'],
    async run(client, message) {

        let user = message.mentions.users.first()

        if(!user) {
            user = "https://cdn.discordapp.com/attachments/784852925989126215/862127934332338176/unknown.png";
        } else {
            user = user.avatarURL({ dynamic: false, format: 'png' })
        }
        const wallpaper = await Canvas.loadImage('https://media.discordapp.net/attachments/759870274795208704/833382333934469120/images_5.png?width=500&height=510');
        const avatar = await Canvas.loadImage(user);
        const canva = Canvas.createCanvas(wallpaper.width, wallpaper.height);
        const ctx = canva.getContext('2d');
       
        ctx.drawImage(wallpaper, 0, 0, canva.width, canva.height);
        ctx.drawImage(avatar, 20, 170, 200, 200);
        const attach = new Discord.MessageAttachment(canva.toBuffer(), `${user.tag}.png`);
        message.reply(attach);

    }
}