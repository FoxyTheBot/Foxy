import { createEmbed } from "../../../utils/discord/Embed";
import { bot } from "../../../FoxyLauncher";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default class TopExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const subCommand = await context.getSubCommand();
        await context.sendDefer();

        switch (subCommand) {
            case "cakes": {
                const users = await bot.database.getAllUsers();
                const sortedData = users.sort((a, b) => b.userCakes.balance - a.userCakes.balance);
                const embed = createEmbed({});
                
                embed.title = context.makeReply(bot.emotes.FOXY_DAILY, t('commands:top.cakes.global.title'));

                const fields = await Promise.all(
                    sortedData.slice(0, 15).map(async (userData, index) => {
                        const user = await bot.users.get(BigInt(userData._id)) ?? bot.helpers.getUser(userData._id);
                        const displayName = await bot.rest.foxy.getUserDisplayName((await user).id);
                        return {
                            name: `${index + 1}º - ${displayName}`,
                            value: `**${userData.userCakes.balance.toLocaleString(t.lng || 'pt-BR')}** Cakes`,
                            inline: true,
                        };
                    })
                );

                embed.fields = fields;
                embed.footer = {
                    text: `Você está em ${parseInt(String(sortedData.map(m => m._id).indexOf(String(context.interaction.user.id)))) + 1}º lugar`
                }
                
                context.reply({
                    embeds: [embed],
                });

                return endCommand();
            }

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