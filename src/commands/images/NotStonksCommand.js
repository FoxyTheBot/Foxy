const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Canvas = require("canvas");
const { MessageAttachment } = require("discord.js");

module.exports = class NotStonks extends Command {
    constructor(client) {
        super(client, {
            name: "notstonks",
            category: "image",
            data: new SlashCommandBuilder()
                .setName("notstonks")
                .setDescription("[🖼 Images] Cria um meme com Not Stonks")
                .addStringOption(option => option.setName("text").setDescription("Texto que vai na imagem").setRequired(true))
        });
    }

    async execute(interaction) {
        const string = interaction.options.getString("text");
        const canvas = Canvas.createCanvas(800, 600);
        const ctx = canvas.getContext('2d');

        await interaction.deferReply();
        const background = await Canvas.loadImage('https://cdn.foxywebsite.ml/memes/notstonks.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.font = '40px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.fillText(`${string}`, canvas.width / 13.1, canvas.height / 14.1);

        ctx.beginPath();
        ctx.arc(125, 125, 100, 6, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const attachment = new MessageAttachment(canvas.toBuffer(), 'notstonks.png');

        await interaction.editReply({ files: [attachment] });
    }
}