import Command from '../../structures/BaseCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

export default class MinecraftCommand extends Command {
    constructor(client) {
        super(client, {
            name: "mine",
            description: "Show Minecraft's Account info",
            category: "misc",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("mine")
                .setDescription("[🛠 Misc] - Show Minecraft's account info")
                .addSubcommand(command => command.setName("body").setDescription("[🛠 Misc] - Get the body of a Minecraft Player").addStringOption(opt => opt.setName("player").setDescription("The player you want to get the body of").setRequired(true)))
                .addSubcommand(command => command.setName("skin").setDescription("[🛠 Misc] - Get the skin of a Minecraft player").addStringOption(opt => opt.setName("player").setDescription("The player you want to get the skin of").setRequired(true)))
                .addSubcommand(command => command.setName("head").setDescription("[🛠 Misc] - Get the head of a Minecraft player").addStringOption(opt => opt.setName("player").setDescription("The player you want to get the head of").setRequired(true)))
        });
    }

    async execute(interaction, t): Promise<void> {
        const commands = interaction.options.getSubcommand();

        switch (commands) {
            case 'body': {
                const user = interaction.options.getString("player");
                if (user.length > 20) return interaction.reply(t('commands:mcbody.tooLong'));

                const embed = new MessageEmbed()
                    .setColor("BLURPLE")
                    .setTitle(t('commands:mcbody.title', { user: user }))
                    .setImage(`https://mc-heads.net/body/${user}`)

                await interaction.reply({ embeds: [embed] });
                break;
            }

            case 'head': {
                const user = interaction.options.getString("player");
                if (user.length > 20) return interaction.reply(t('commands:mchead.tooLong'));

                const embed = new MessageEmbed()
                    .setColor("BLURPLE")
                    .setTitle(t('commands:mchead.title', { user: user }))
                    .setImage(`https://mc-heads.net/head/${user}`)

                await interaction.reply({ embeds: [embed] });
                break;
            }

            case 'skin': {
                const user = interaction.options.getString("player");
                if (user.length > 20) return interaction.reply(t('commands:mcskin.tooLong'));

                const embed = new MessageEmbed()
                    .setColor("BLURPLE")
                    .setTitle(t('commands:mcskin.title', { user: user }))
                    .setImage(`https://mc-heads.net/body/${user}`)

                await interaction.reply({ embeds: [embed] });
                break;
            }
        }


    }
}