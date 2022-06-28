import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import ms from "ms";

export default class RepCommand extends Command {
    constructor(client) {
        super(client, {
            name: "rep",
            description: "Give someone a reputation point",
            category: "social",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("rep")
                .setDescription("[Social] Give someone a reputation point")
        });
    }

    async execute(interaction, t): Promise<void> {
        const user = await interaction.options.getUser("user");
        if (!user) return interaction.reply(t('commands:global.noUser'));
        if (user === interaction.user) return interaction.reply(t("commands:rep.self"));

        const userData = await this.client.database.getUser(user.id);
        const authorData = await this.client.database.getUser(interaction.user.id);

        const repCooldown = 3600000;

        if (repCooldown - (Date.now() - authorData.lastRep) > 0) {
            const currentCooldown = ms(repCooldown - (Date.now() - authorData.lastRep));
            return interaction.reply(t("commands:rep.cooldown", { cooldown: currentCooldown }));
        } else {
            userData.repCount++;
            authorData.lastRep = Date.now();
            authorData.save();
            userData.save();
            return interaction.reply(t("commands:rep.success", { user: user.username }));
        }
    }
}