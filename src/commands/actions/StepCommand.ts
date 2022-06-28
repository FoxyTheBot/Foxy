import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

export default class StepCommand extends Command {
    constructor(client) {
        super(client, {
            name: "step",
            description: "Step on a user",
            category: "actions",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("step")
                .setDescription("[Roleplay] Step on a user")
                .addUserOption(option => option.setName("user").setRequired(true).setDescription("User you want to step on"))
        });
    }

    async execute(interaction, t): Promise<void> {
        const user = interaction.options.getUser("user");
        if (!user) return interaction.reply(t('commands:global.noUser'));

        const list = [
            'https://cdn.discordapp.com/attachments/745396328351268885/776930400990920734/6a0.gif',
            'https://cdn.discordapp.com/attachments/745396328351268885/776930405181554698/tenor_10.gif',
            'https://cdn.discordapp.com/attachments/745396328351268885/776930416966893588/tenor_8.gif',
        ]

        const rand = list[Math.floor(Math.random() * list.length)];

        const embed = new MessageEmbed()
            .setColor("BLURPLE")
            .setDescription(t('commands:step.success', { user: user.username }))
            .setImage(rand)

        await interaction.reply({ embeds: [embed] });
    }
}