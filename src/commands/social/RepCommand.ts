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
                .addUserOption(option => option.setName("user").setDescription("Mentions someone or use the ID").setRequired(true))
        });
    }

    async execute(ctx, t): Promise<void> {
        const user = await ctx.options.getUser("user");
        if (!user) return ctx.reply(t('commands:global.noUser'));
        if (user === ctx.user) return ctx.reply(t("commands:rep.self"));

        const userData = await this.client.database.getUser(user.id);
        const authorData = await this.client.database.getUser(ctx.user.id);

        const repCooldown = 3600000;

        if (repCooldown - (Date.now() - authorData.lastRep) > 0) {
            const currentCooldown = ms(repCooldown - (Date.now() - authorData.lastRep));
            return ctx.reply(t("commands:rep.cooldown", { cooldown: currentCooldown }));
        } else {
            userData.repCount++;
            authorData.lastRep = Date.now();
            authorData.save();
            userData.save();
            return ctx.reply(t("commands:rep.success", { user: user.username }));
        }
    }
}