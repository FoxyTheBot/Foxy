const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");

module.exports = class OurCommand extends Command {
    constructor(client) {
        super(client, {
            name: "comunismo",
            category: "image",
            data: new SlashCommandBuilder()
                .setName("comunismo")
                .setDescription("[🖼 Images] John Xina")
                .addStringOption(option => option.setName("text").setDescription("Texto que será inserido na imagem").setRequired(true))
        });
    }
    async execute(interaction) {
        const string = interaction.options.getString("text");
        const canvas = Canvas.createCanvas(500, 400);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('https://foxywebsite.xyz/api/memes/comunismo.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.font = '28px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.fillText(`${string}`, canvas.width / 15.5, canvas.height / 13.5);

        ctx.beginPath();
        ctx.arc(125, 125, 100, 6, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const attachment = new MessageAttachment(canvas.toBuffer(), 'comunismo.png');
        await interaction.editReply({ files: [attachment] });

    }
}