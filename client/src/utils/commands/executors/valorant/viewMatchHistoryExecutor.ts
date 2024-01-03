import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../index";
import { createEmbed } from "../../../discord/Embed";
import { createCustomId } from "../../../discord/Component";
import { createSelectMenu } from "../../../discord/Component";
import { createActionRow } from "../../../discord/Component";

const ViewMatchHistory = async (context: ComponentInteractionContext) => {
    const [user] = context.sentData
    const userData = await bot.database.getUser(user);

    context.sendDefer();
    const matchInfo: any = await bot.foxyRest.getValMatchHistoryByUUID(userData.riotAccount.puuid);
    const valUserInfo = await bot.foxyRest.getValPlayerByUUID(userData.riotAccount.puuid);

    try {
        const embed = createEmbed({
            color: 0xf84354,
            thumbnail: {
                url: valUserInfo.data.card.small
            },
            title: context.getEmojiById(bot.emotes.VALORANT_LOGO) + " " + bot.locale('commands:valorant.match.title', { username: valUserInfo.data.name, tag: valUserInfo.data.tag }),
            fields: matchInfo.data.map(match => {
                return {
                    name: `${match.meta.map.name} - ${bot.locale(`commands:valorant.match.modes.${match.meta.mode.toLowerCase()}`)}`,
                    value: `${bot.locale('commands:valorant.match.character')}: ${context.getEmojiById(bot.emotes[match.stats.character.name.toUpperCase() ?? bot.emotes.FOXY_SHRUG])} \nK/D/A: ${match.stats.kills}/${match.stats.deaths}/${match.stats.assists} \n${bot.locale('commands:valorant.match.result')}: ${match.teams.red && match.teams.blue ? `${bot.locale('commands:valorant.teams.t')}: ${match.teams.red} / ${bot.locale('commands:valorant.teams.ct')}: ${match.teams.blue}` : bot.locale('commands:valorant.noResult')}\n`,
                    inline: true
                }
            }),
            footer: {
                text: bot.locale("commands:valorant.match.footer")
            }
        });

        return context.sendReply({
            embeds: [embed]
        });
    } catch (err) {
        return context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale('commands:valorant.match.notFound'))
        });
    }
}
export default ViewMatchHistory;