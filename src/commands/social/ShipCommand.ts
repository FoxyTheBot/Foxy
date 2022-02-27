import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, MessageAttachment } from "discord.js";
import * as Canvas from "canvas";

export default class ShipCommand extends Command {
    constructor(client) {
        super(client, {
            name: "ship",
            description: "Ship someone",
            category: "social",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("ship")
                .setDescription("[👥 Social] Ship someone")
                .addUserOption(option => option.setName("user").setDescription("Mentions someone").setRequired(true))
                .addUserOption(option => option.setName("user2").setDescription("Mentions someone again").setRequired(true))
        });
    }

    async execute(interaction, t): Promise<void> {
        const user = interaction.options.getUser("user");
        const user2 = interaction.options.getUser("user2");
        if(!user || user2) return interaction.editReply(t('commands:global.noUser'));

        const love = Math.floor(Math.random() * 100);

        const loveIndex = Math.floor(love / 10);
        const loveLevel = '█'.repeat(loveIndex) + '.'.repeat(10 - loveIndex);

        const firstName = user.username.length;
        const secondName = user.username;

        const calc1 = firstName - 4;
        const calc2 = secondName - 4;

        let nomeship;
        if (love > 60) {
            nomeship = user.username.slice(0, 3) + user2.username.slice(0, 3);
        } else if (love >= 40) {
            nomeship = user.username.slice(0, calc1) + user2.username.slice(0, calc2);
        } else {
            nomeship = user.username.slice(calc1, firstName) + user2.username.slice(calc2, secondName);
        }

        let desc;
        if (love > 90) {
            desc = (`:sparkling_heart: ${t('commands:ship.question')} :sparkling_heart:\n\`${user.username}\`\n\`${user2.username}\`\n:heart: \`${nomeship}\` ${t('commands:ship.perfectCouple')} :heart:`);
        } else if (love >= 70) {
            desc = (`:sparkling_heart: ${t('commands:ship.question')} :sparkling_heart:\n\`${user.username}\`\n\`${user2.username}\`\n:neutral_face: \`${nomeship}\` ${t('commands:ship.uwu')} :neutral_face:`);
        } else if (love >= 45) {
            desc = (`:sparkling_heart: ${t('commands:ship.question')} :sparkling_heart:\n\`${user.username}\`\n\`${user2.username}\`\n:no_mouth: \`${nomeship}\` ${t('commands:ship.probably', { user: user2.username})} :no_mouth:`);
        } else {
            desc = (`:sparkling_heart: ${t('commands:ship.question')} :sparkling_heart:\n\`${user.username}\`\n\`${user2.username}\`\n:cry: \`${nomeship}\` ${t('commands:ship.cry')} :cry: `);
        }

        let emoticon;
        if (love > 60) {
            emoticon = ('https://cdn.glitch.com/00963c7e-8e86-4a55-8d85-36add9e330d7%2Femoji_2.png?v=1593651528429');
        } else if (love >= 40) {
            emoticon = ('https://cdn.glitch.com/00963c7e-8e86-4a55-8d85-36add9e330d7%2Femoji_3-1.png?v=1593652255529');
        } else {
            emoticon = ('https://cdn.glitch.com/00963c7e-8e86-4a55-8d85-36add9e330d7%2Femoji_1.png?v=1593651511900');
        }

        const canvas = Canvas.createCanvas(384, 128);
        const ctx = canvas.getContext('2d');
        const emotes = await Canvas.loadImage(emoticon);
        const avatar1 = await Canvas.loadImage(user.displayAvatarURL({ format: "png" }));
        const avatar2 = await Canvas.loadImage(user2.displayAvatarURL({ format: "png" }));

        ctx.drawImage(emotes, 125, 0, 128, 128);
        ctx.drawImage(avatar1, -10, 0, 128, 128);
        ctx.drawImage(avatar2, 260, 0, 128, 128);
        const img = await new MessageAttachment(canvas.toBuffer(), 'ship.png')

        const shipEmbed = new MessageEmbed()
            .setDescription(`**${love}%** [\`${loveLevel}\`]`)
            .setImage("attachment://ship.png")
        interaction.editReply({ content: desc, embeds: [shipEmbed], files: [img] });
    }
}