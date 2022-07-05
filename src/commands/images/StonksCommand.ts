import Command from "../../structures/command/BaseCommand";
import * as Canvas from "canvas";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageAttachment } from "discord.js";

export default class StonksCommand extends Command {
    constructor(client) {
        super(client, {
            name: "stonks",
            description: "Get a stonks image",
            category: "image",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("stonks")
                .setDescription("[Images] Get a stonks image")
                .addStringOption(option => option.setName("text").setRequired(true).setDescription("The text you want to put on the stonks"))
        });
    }

    async execute(interaction, t): Promise<void> {
        const content: string = interaction.options.getString("text");

        const canvas = Canvas.createCanvas(800, 600);
        const ctx = canvas.getContext("2d");

        const background = await Canvas.loadImage("http://localhost:8081/memes/stonks.png");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.font = '28px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.fillText(content, canvas.width / 15.5, canvas.height / 13.5);

        ctx.beginPath();
        ctx.arc(125, 125, 100, 6, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const attachment = new MessageAttachment(canvas.toBuffer(), 'stonks.png');

        await interaction.reply({ files: [attachment] });
    }
}