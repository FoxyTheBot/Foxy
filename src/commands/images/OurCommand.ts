import Command from '../../structures/command/BaseCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { AttachmentBuilder } from 'discord.js';
import * as Canvas from 'canvas';

export default class PerfectCommand extends Command {
    constructor(client) {
        super(client, {
            name: "our",
            description: "Get a comunism image",
            category: "image",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("our")
                .setDescription("[Images] Get a comunism image")
                .addStringOption(option => option.setName("text").setDescription("The text").setRequired(true))
        });
    }

    async execute(interaction, t): Promise<void> {
        const content: string = interaction.options.getString("text");
        const canvas = Canvas.createCanvas(500, 400);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('http://localhost:8080/memes/comunismo.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.font = '28px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.fillText(`${content}`, canvas.width / 15.5, canvas.height / 13.5);

        ctx.beginPath();
        ctx.arc(125, 125, 100, 6, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const attachment = new AttachmentBuilder(canvas.toBuffer());
        await interaction.reply({ files: [attachment] });
    }
}