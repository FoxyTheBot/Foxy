import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageAttachment } from "discord.js";
import Command from '../../structures/BaseCommand';
import * as Canvas from 'canvas';

export default class JojoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'jojo',
            description: 'Create a Jojo Battle image',
            category: 'image',
            dev: false,
            data: new SlashCommandBuilder()
                .setName('jojo')
                .setDescription('[Images] Create a Jojo Battle image')
                .addSubcommand(subcommand => subcommand.setName("menacing").setDescription("Create a menacing Jojo Battle image").addUserOption(option => option.setName("user").setDescription("Select the user to be Dio").setRequired(true)).addUserOption(option => option.setName("user2").setDescription("Select user to be Jotaro").setRequired(false)))
        })
    }

    async execute(interaction, t): Promise<void> {
        const user = interaction.options.getUser('user');
        let user2 = interaction.options.getUser('user2');
        if (!user2) user2 = interaction.user;
        if (!user) return interaction.reply(t('commands:global.noUser'));
        await interaction.deferReply();

        const canvas = Canvas.createCanvas(800, 450);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('https://cdn.discordapp.com/attachments/789266900852408351/983485873704271972/4k9p6a.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        const avatar = await Canvas.loadImage(user.displayAvatarURL({ dynamic: true, format: 'png' }));
        const avatar2 = await Canvas.loadImage(user2.displayAvatarURL({ dynamic: true, format: 'png' }));

        ctx.drawImage(avatar, 150, 2, 100, 100);
        ctx.drawImage(avatar2, 500, 135, 74, 75);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'jojo.png');
        await interaction.editReply({ files: [attachment] });
    }
}