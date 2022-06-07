import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";

export default class FateCommand extends Command {
    constructor(client) {
        super(client, {
            name: "fate",
            description: "What is your fate with mentioned user?",
            category: "fun",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("fate")
                .setDescription("[Entertainment] What is your fate with mentioned user?")
                .addUserOption(option => option.setName("user").setDescription("User to check fate with").setRequired(true))
        });
    }

    async execute(interaction, t): Promise<void> {
        const user = interaction.options.getUser("user");
        if (!user) return interaction.reply(t('commands:global.noUser'));

        const list = [
            t('commands:fate.couple'),
            t('commands:fate.friend'),
            t('commands:fate.lover'),
            t('commands:fate.enemy'),
            t('commands:fate.sibling'),
            t('commands:fate.parent'),
            t('commands:fate.married')
        ]

        const rand = list[Math.floor(Math.random() * list.length)];
        await interaction.reply(t('commands:fate.result', { user: interaction.user.id, fate: rand, mention: user.id }));
    }
}