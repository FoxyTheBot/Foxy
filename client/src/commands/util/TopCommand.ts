import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { bot } from "../../index";

const TopCommand = createCommand({
    name: "top",
    description: "[Utils] See the rank of cakes",
    descriptionLocalizations: {
        "pt-BR": "[Utils] Veja o rank de cakes"
    },
    category: "util",
    options: [{
        name: "cakes",
        description: "[Utils] See the cakes rank",
        descriptionLocalizations: {
            "pt-BR": "[Utils] Veja o rank de cakes"
        },
        type: ApplicationCommandOptionTypes.SubCommand
    }],

    async execute(context, endCommand, t) {
        const subCommand = context.getSubCommand();

        switch (subCommand) {
            case "cakes": {
                let data = await bot.database.getAllUsers();
                await context.sendDefer();
                data = data.sort((a, b) => b.balance - a.balance);

                const embed = createEmbed({});
                embed.title = context.makeReply(bot.emotes.FOXY_DAILY, "Cakes Global Rank");
                let fields = embed.fields = [];
                for (let i in data) {
                    if (Number(i) > 14) break;
                    let user = await bot.helpers.getUser(data[i]._id);
                    fields.push({
                        name: `${parseInt(data.map(m => m._id).indexOf(data[i]._id)) + 1}º - \`${user.username}#${user.discriminator}\``,
                        value: `**${parseInt(data[i].balance)}** Cakes`,
                        inline: true,
                    });
                }

                context.sendReply({
                    embeds: [embed],
                });

                endCommand();
                break;
            }
        }
    }
})

export default TopCommand;