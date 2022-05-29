import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageAttachment } from "discord.js";
import * as Canvas from "canvas";

export default class PerfectCommand extends Command {
    constructor(client) {
        super(client, {
            name: "perfect",
            description: "Who is the perfect person?",
            category: "image",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("perfect")
                .setDescription("[🖼 Image] Who is the perfect person?")
                .addUserOption(option => option.setName("user").setDescription("Mention some user").setRequired(false))
        });
    }

    async execute(interaction, t): Promise<void> {
        const user = interaction.options.getUser("user");
        if (!user) return interaction.reply(t('commands:global.noUser'));
        const canvas = Canvas.createCanvas(467, 400);
        const ctx = canvas.getContext("2d");

        let avatar: string;
        if (!user) {
            avatar = this.client.user.displayAvatarURL({ format: "png", size: 1024 });
        } else {
            avatar = user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })
        }

        const background = await Canvas.loadImage('https://foxywebsite.xyz/api/memes/perfeito.png');
        ctx.drawImage(background, 0, 0, 467, 400);

        const userAvatar = await Canvas.loadImage(avatar);
        ctx.drawImage(userAvatar, 400 - 177, 30 + 20, 400 - 178, 400 - 179)

        const attachment = new MessageAttachment(canvas.toBuffer(), 'pf.png');

        await interaction.reply({ files: [attachment] });
    }
}