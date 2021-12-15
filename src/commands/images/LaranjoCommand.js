const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Canvas = require("canvas");
const { MessageAttachment } = require("discord.js");

module.exports = class LaranjoCommand extends Command {
    constructor(client) {
        super(client, {
            name: "laranjo",
            category: "image",
            data: new SlashCommandBuilder()
                .setName("laranjo")
                .setDescription("[🖼 Images] Laranja Laranjo")
                .addStringOption(option => option.setName("text").setDescription("Texto que vai na imagem").setRequired(true))
        })
    }

    async execute(interaction) {
        const string = interaction.options.getString("text");
        const canvas = Canvas.createCanvas(700, 600);
        const ctx = canvas.getContext('2d');

        await interaction.deferReply();
        const background = await Canvas.loadImage('https://cdn.foxywebsite.ml/memes/laranjo.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.font = '33px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.fillText(`${string}`, canvas.width / 15.5, canvas.height / 13.5);

        ctx.beginPath();
        ctx.arc(125, 125, 100, 6, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const attachment = new MessageAttachment(canvas.toBuffer(), 'laranja_laranjo.png');

        await interaction.editReply({ files: [attachment] });
    }
}