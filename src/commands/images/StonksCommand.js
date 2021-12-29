const { MessageAttachment } = require('discord.js');
const Command = require('../../structures/Command');
const { SlashCommandBuilder } = require("@discordjs/builders");
const Canvas = require('canvas');

module.exports = class StonksCommand extends Command {
    constructor(client) {
        super(client, {
            name: "stonks",
            category: "image",
            data: new SlashCommandBuilder()
                .setName("stonks")
                .setDescription("[🖼 Images] Cria um meme stonks")
                .addStringOption(option => option.setName("text").setRequired(true).setDescription("Texto do meme"))
        });
    }

    async execute(interaction) {
        const string = interaction.options.getString("text");

        const canvas = Canvas.createCanvas(800, 600);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('https://cdn.foxywebsite.xyz/memes/stonks.png');
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

        const attachment = new MessageAttachment(canvas.toBuffer(), 'stonks.png');

        await interaction.editReply({ files: [attachment] });
    }
}