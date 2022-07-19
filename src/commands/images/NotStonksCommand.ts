import Command from '../../structures/command/BaseCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { AttachmentBuilder } from 'discord.js';
import * as Canvas from 'canvas';

export default class NotStonks extends Command {
    constructor(client) {
        super(client, {
            name: "notstonks",
            description: "Get a not stonks image",
            category: "image",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("notstonks")
                .setDescription("[Images] Get a not stonks image")
                .addStringOption(option => option.setName("text").setDescription("The text").setRequired(true))
        });
    }

    async execute(ctx, t): Promise<void> {
        const string = ctx.options.getString("text");
        const canvas = Canvas.createCanvas(800, 600);
        const imageContext = canvas.getContext('2d');

        const background = await Canvas.loadImage('http://localhost:8080/memes/notstonks.png');
        imageContext.drawImage(background, 0, 0, canvas.width, canvas.height);

        imageContext.strokeStyle = '#74037b';
        imageContext.strokeRect(0, 0, canvas.width, canvas.height);

        imageContext.font = '40px sans-serif';
        imageContext.fillStyle = '#000000';
        imageContext.fillText(`${string}`, canvas.width / 13.1, canvas.height / 14.1);

        imageContext.beginPath();
        imageContext.arc(125, 125, 100, 6, Math.PI * 2, true);
        imageContext.closePath();
        imageContext.clip();

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "notstonks.png" });

        await ctx.reply({ files: [attachment] });
    }
}