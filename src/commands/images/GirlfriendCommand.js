const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Canvas = require("canvas");
const { MessageAttachment } = require("discord.js");

module.exports = class GirlfriendCommand extends Command {
    constructor(client) {
        super(client, {
            name: "girlfriend",
            category: "image",
            data: new SlashCommandBuilder()
                .setName("girlfriend")
                .setDescription("Quem é a sua namorada?")
                .addUserOption(option => option.setName("user").setDescription("Mencione alguém").setRequired(false))
        })
    }

    async execute(interaction) {
        const user = interaction.options.getUser("user");

        var avatar;
        if (!user) {
            avatar = "https://cdn.discordapp.com/attachments/784852925989126215/862127934332338176/unknown.png";
        } else {
            avatar = user.displayAvatarURL({ dynamic: false, format: 'png' });
        }

        const background = await Canvas.loadImage("./src/assets/namorada.png");
        const userAvatar = avatar;
        const canvas = Canvas.createCanvas(500, 510);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(background, 0, 0, canva.width, canva.height);
        ctx.drawImage(userAvatar, 20, 170, 200, 200);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'minha_namorada.png');
        await interaction.reply({ files: [attachment] });
    }
}