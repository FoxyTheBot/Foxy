import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageAttachment } from "discord.js";
import * as Canvas from "canvas";

export default class LaranjoCommand extends Command {
    constructor(client) {
        super(client, {
            name: "laranjo",
            description: "Get a laranjo image",
            category: "image",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("laranjo")
                .setDescription("[Images] Get a laranjo image")
                .addStringOption(option => option.setName("text").setDescription("The text").setRequired(true))
        });
    }

    async execute(interaction, t): Promise<void> {
        const string = interaction.options.getString("text");
        const canvas = Canvas.createCanvas(700, 600);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('https://foxywebsite.xyz/api/memes/laranjo.png');
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

        await interaction.reply({ files: [attachment] });
    }
}