const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Canvas = require("canvas");
const { MessageAttachment } = require("discord.js");

module.exports = class ErrorCommand extends Command {
    constructor(client) {
        super(client, {
            name: "error",
            category: "image",
            data: new SlashCommandBuilder()
                .setName("error")
                .setDescription("[🖼 Images] Crie uma mensagem de erro do Windows")
                .addStringOption(option => option.setName("text").setDescription("Texto que será inserido na imagem").setRequired(true))
        })
    }

    async execute(interaction) {
        var string = interaction.options.getString("text");
        const canvas = Canvas.createCanvas(380, 208);
        const ctx = canvas.getContext("2d");

        await interaction.deferReply();
        const background = await Canvas.loadImage("https://cdn.foxywebsite.ml/memes/windows.png");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);


        if (string.length > 30) {
            const check = string.match(/.{1,35}/g);
            string = check.join("\n");
        }
        if(string.length > 100) return interaction.reply("Você não pode digitar mais de 100 caractéres!")

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
        ctx.font = '15px Sans';
        ctx.fillStyle = '#000000';
        ctx.fillText(`${string}`, canvas.width / 5.3, canvas.height / 2.2);
    
        ctx.beginPath();
        ctx.arc(125, 125, 100, 6, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const attachment = await new MessageAttachment(canvas.toBuffer(), 'error.png');

        await interaction.editReply({ files: [attachment] });
    }
}