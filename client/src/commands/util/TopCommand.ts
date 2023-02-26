import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { bot } from "../../index";

const TopCommand = createCommand({
    name: "top",
    description: "[Utils] See the rank of paws",
    descriptionLocalizations: {
        "pt-BR": "[Utils] Veja o rank de paws"
    },
    category: "util",
    options: [{
        name: "paws",
        description: "[Utils] See the paws rank",
        descriptionLocalizations: {
            "pt-BR": "[Utils] Veja o rank de paws"
        },
        type: ApplicationCommandOptionTypes.SubCommand
    }],

    async execute(context, endCommand, t) {
        const subCommand = context.getSubCommand();

        switch (subCommand) {
            case "paws": {
                let data = await bot.database.getAllUsers();
                await context.defer();
                data = data.sort((a, b) => b.balance - a.balance);

                const embed = createEmbed({});
                embed.title = context.makeReply(bot.emotes.FOXY_DAILY, "Paws Global Rank");
                let fields = embed.fields = [];
                for (let i in data) {
                    if (Number(i) > 14) break;
                    let user = await bot.helpers.getUser(data[i]._id);
                    fields.push({
                        name: `${parseInt(data.map(m => m._id).indexOf(data[i]._id)) + 1}º - \`${user.username}#${user.discriminator}\``,
                        value: `**${parseInt(data[i].balance)}** Paws`,
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