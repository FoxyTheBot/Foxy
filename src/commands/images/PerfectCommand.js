const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");

module.exports = class PerfectCommand extends Command {
    constructor(client) {
        super(client, {
            name: "perfect",
            category: "image",
            data: new SlashCommandBuilder()
                .setName("perfect")
                .setDescription("[🖼 Images] Existe algo perfeito?")
                .addUserOption(option => option.setName("user").setDescription("Mencione um usuário").setRequired(false))
        });
    }

    async execute(interaction) {
        const user = interaction.options.getUser("user");

        await interaction.deferReply();
        const canvas = Canvas.createCanvas(467, 400);
        const ctx = canvas.getContext('2d');

        var avatar;
        if (!user) {
            avatar = this.client.user.displayAvatarURL({ format: "png", size: 1024 });
        } else {
            avatar = user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
        }

        const background = await Canvas.loadImage('https://cdn.foxywebsite.ml/memes/perfeito.png');
        ctx.drawImage(background, 0, 0, 467, 400);

        const userAvatar = await Canvas.loadImage(avatar);
        ctx.drawImage(userAvatar, 400 - 177, 30 + 20, 400 - 178, 400 - 179)

        const attachment = new MessageAttachment(canvas.toBuffer(), 'pf.png');

        await interaction.editReply({ files: [attachment] });
    }
}