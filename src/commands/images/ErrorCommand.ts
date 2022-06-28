import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageAttachment } from "discord.js";
import * as Canvas from "canvas";

export default class ErrorCommand extends Command {
    constructor(client) {
        super(client, {
            name: "error",
            description: "Get a Windows error message",
            category: "image",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("error")
                .setDescription("[Images] Get a Windows error message")
                .addStringOption(option => option.setName("text").setDescription("The text of the error").setRequired(true))
        });
    }

    async execute(interaction, t): Promise<void> {
        var string = interaction.options.getString("text");
        const canvas = Canvas.createCanvas(380, 208);
        const ctx = canvas.getContext("2d");

        const background = await Canvas.loadImage("https://foxywebsite.xyz/api/memes/windows.png");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);


        if (string.length > 30) {
            const check = string.match(/.{1,35}/g);
            string = check.join("\n");
        }
        if (string.length > 100) return interaction.reply(t('commands:error.tooLong', { limit: 100 }));

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

        await interaction.reply({ files: [attachment] });
    }
}