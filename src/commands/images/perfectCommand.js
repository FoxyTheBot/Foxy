const { MessageAttachment } = require('discord.js');

module.exports = {
    name: "perfect",
    aliases: ['perfect', 'perfeito'],
    clientPerms: ['ATTACH_FILES'],

    async run(client, message) {

        const { createCanvas, loadImage } = require('canvas');

        const canvas = createCanvas(467, 400);
        const ctx = canvas.getContext('2d');

        let user = message.mentions.users.first();

        if (!user) {
            user = "https://cdn.discordapp.com/avatars/772554697298673677/0663ea5e349a6ac23103e62b768c43f8.png?size=2048"
        } else {
            user = user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
        }

        const fundo1 = await loadImage('https://cdn.discordapp.com/attachments/688436947516915764/701160106296868955/perfeito.png');
        ctx.drawImage(fundo1, 0, 0, 467, 400);

        const avatar = await loadImage(user)
        ctx.drawImage(avatar, 400 - 177, 30 + 20, 400 - 178, 400 - 179)

        const image2 = await loadImage('https://cdn.discordapp.com/attachments/688436947516915764/701160545440497735/redondo.png?width=475&400=475')
        ctx.drawImage(image2, 400 - 177, 30 + 20, 400 - 178, 400 - 179)

        const attachment = new MessageAttachment(canvas.toBuffer(), 'pf.png');

        await message.foxyReply(attachment);
    }
}