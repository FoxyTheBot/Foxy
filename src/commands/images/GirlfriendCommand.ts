import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageAttachment } from "discord.js";
import * as Canvas from "canvas";

export default class GirlfriendCommand extends Command {
    constructor(client) {
        super(client, {
            name: "girlfriend",
            description: "Who is your girlfriend?",
            category: "image",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("girlfriend")
                .setDescription("[Images] Who is your girlfriend?")
                .addUserOption(option => option.setName("user").setDescription("Mention some user").setRequired(false))
        });
    }

    async execute(interaction, t): Promise<void> {
        const user = interaction.options.getUser("user");
        if (!user) return interaction.reply(t('commands:global.noUser'));

        var avatar;
        if (!user) {
            avatar = "https://cdn.discordapp.com/attachments/784852925989126215/862127934332338176/unknown.png";
        } else {
            avatar = user.displayAvatarURL({ dynamic: true, format: 'png' });
        }

        const background = await Canvas.loadImage("https://foxywebsite.xyz/api/memes/namorada.png");
        const avatarImg = await Canvas.loadImage(avatar);
        const canvas = Canvas.createCanvas(500, 510);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(avatarImg, 20, 170, 200, 200);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'minha_namorada.png');
        await interaction.reply({ files: [attachment] });
    }
}