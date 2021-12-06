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
        await interaction.deferReply();

        var avatar;
        if (!user) {
            avatar = "https://cdn.discordapp.com/attachments/784852925989126215/862127934332338176/unknown.png";
        } else {
            avatar = user.displayAvatarURL({ dynamic: true, format: 'png' });
        }

        const background = await Canvas.loadImage("https://cdn.foxywebsite.ml/memes/namorada.png");
        const avatarImg = await Canvas.loadImage(avatar);
        const canvas = Canvas.createCanvas(500, 510);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(avatarImg, 20, 170, 200, 200);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'minha_namorada.png');
        await interaction.editReply({ files: [attachment] });
    }
}