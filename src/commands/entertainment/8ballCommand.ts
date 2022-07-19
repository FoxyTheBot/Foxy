import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";

export default class EightBallCommand extends Command {
    constructor(client) {
        super(client, {
            name: "8ball",
            description: "Magic 8-ball",
            category: "fun",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("8ball")
                .setDescription("[Entertainment] Magic 8-ball")
                .addStringOption(option => option.setName("text").setDescription("Question").setRequired(true))
        });
    }

    async execute(ctx, t): Promise<void> {
        const results = [
            t('commands:8ball.yes'),
            t('commands:8ball.no'),
            t('commands:8ball.maybe'),
            t('commands:8ball.idk'),
            t('commands:8ball.idk2'),
            t('commands:8ball.probablyyes'),
            t('commands:8ball.probablyno'),
            t('commands:8ball.probably')
        ];

        const result = results[Math.floor(Math.random() * results.length)];

        await ctx.reply(result)
    }
}
