import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { AttachmentBuilder } from "discord.js";
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

    async execute(ctx, t): Promise<void> {
        var string = ctx.options.getString("text");
        const canvas = Canvas.createCanvas(380, 208);
        const imageContext = canvas.getContext("2d");

        const background = await Canvas.loadImage("http://localhost:8080/memes/windows.png");
        imageContext.drawImage(background, 0, 0, canvas.width, canvas.height);


        if (string.length > 30) {
            const check = string.match(/.{1,35}/g);
            string = check.join("\n");
        }
        if (string.length > 100) return ctx.reply(t('commands:error.tooLong', { limit: 100 }));

        imageContext.strokeStyle = '#74037b';
        imageContext.strokeRect(0, 0, canvas.width, canvas.height);

        imageContext.font = '15px Sans';
        imageContext.fillStyle = '#000000';
        imageContext.fillText(`${string}`, canvas.width / 5.3, canvas.height / 2.2);

        imageContext.beginPath();
        imageContext.arc(125, 125, 100, 6, Math.PI * 2, true);
        imageContext.closePath();
        imageContext.clip();

        const attachment = await new AttachmentBuilder(canvas.toBuffer(), { name: "error.png" });

        await ctx.reply({ files: [attachment] });
    }
}