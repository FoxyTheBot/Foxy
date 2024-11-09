import { createEmbed } from "../../../utils/discord/Embed";
import { bot } from "../../../FoxyLauncher";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default class TopExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const subCommand = await context.getSubCommand();

        switch (subCommand) {
            // Removed for maintenance
            // case "cakes": {
            //     let data: any = await bot.database.getAllUsers();
            //     await context.sendDefer();
            //     data = data.sort((a, b) => b.userCakes.balance - a.userCakes.balance);

            //     const embed = createEmbed({});
            //     embed.title = context.makeReply(bot.emotes.FOXY_DAILY, "Cakes Global Rank");
            //     let fields = embed.fields = [];
            //     for (let i in data) {
            //         if (Number(i) > 14) break;
            //         let user = await bot.users.get(BigInt(data[i]._id))
            //             ?? bot.helpers.getUser(data[i]._id);
            //         fields.push({
            //             name: `${parseInt(data.map(m => m._id).indexOf(data[i]._id)) + 1}º - ${await bot.rest.foxy.getUserDisplayName((await user).id)}`,
            //             value: `**${parseInt(data[i].userCakes.balance).toLocaleString(t.lng || 'pt-BR')}** Cakes`,
            //             inline: true,
            //         });
            //     }

            //     context.reply({
            //         embeds: [embed],
            //     });

            //     return endCommand();
            //     break;
            // }

            case 'commands': {
                let data: any = await bot.database.getAllCommands();
                const embed = createEmbed({});
                data = data.sort((a, b) => b.commandUsageCount - a.commandUsageCount);
                await context.sendDefer();

                embed.title = context.makeReply(bot.emotes.FOXY_PRAY, t('commands:top.commands.title'));
                embed.footer = {
                    text: t('commands:top.commands.footer', { total: `${await bot.database.getAllUsageCount() as number - 1}` })
                }

                let fields = embed.fields = [];
                for (let i in data) {
                    if (Number(i) > 15) break;
                    let command = bot.commands.get(data[i].commandName);
                    if (!command || command.devsOnly) continue;

                    fields.push({
                        name: `${parseInt(data.map(m => m._id).indexOf(data[i]._id)) + 1}º - ${command.name}`,
                        value: t('commands:top.commands.usageCount', { usageCount: parseInt(data[i].commandUsageCount).toString() }),
                        inline: true,
                    });
                }

                context.reply({
                    embeds: [embed],
                });

                return endCommand();
            }
        }
    }
}