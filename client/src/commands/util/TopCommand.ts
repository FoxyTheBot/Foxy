import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { bot } from "../../index";

const TopCommand = createCommand({
    name: "top",
    description: "[Utils] See the rank of cakes",
    descriptionLocalizations: {
        "pt-BR": "[Utilitários] Veja o rank de cakes"
    },
    category: "util",
    options: [{
        name: "cakes",
        description: "[Utils] See the cakes rank",
        descriptionLocalizations: {
            "pt-BR": "[Utilitários] Veja o rank de cakes"
        },
        type: ApplicationCommandOptionTypes.SubCommand
    },
    {
        name: "commands",
        description: "[Utils] See the commands rank",
        descriptionLocalizations: {
            "pt-BR": "[Utilitários] Veja o rank de comandos"
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
                        name: `${parseInt(data.map(m => m._id).indexOf(data[i]._id)) + 1}º - ${user.username}`,
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

            case 'commands': {
                let data = await bot.database.getAllCommands();

                await context.sendDefer();

                data = data.sort((a, b) => b.commandUsageCount - a.commandUsageCount);

                const embed = createEmbed({});

                embed.title = context.makeReply(bot.emotes.FOXY_DAILY, t('commands:top.commands.title'));
                embed.footer = {
                    text: t('commands:top.commands.footer', { total: `${await bot.database.getAllUsageCount() - 1}` })
                }
                let fields = embed.fields = [];
                for (let i in data) {
                    if (Number(i) > 15) break;
                    let command = bot.commands.get(data[i].commandName);

                    if (command.devsOnly) continue;
                    fields.push({
                        name: `${parseInt(data.map(m => m._id).indexOf(data[i]._id)) + 1}º - ${command.name}`,
                        value: t('commands:top.commands.usageCount', { usageCount: parseInt(data[i].commandUsageCount).toString() }),
                        inline: true,
                    });
                }

                context.sendReply({
                    embeds: [embed],
                })
            }
        }
    }
})

export default TopCommand;