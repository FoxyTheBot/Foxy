import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { bot } from "../../../../FoxyLauncher";
import { createEmbed } from "../../../../utils/discord/Embed";
import { logger } from "../../../../../../../common/utils/logger";

const ViewMatchHistory = async (context: ComponentInteractionContext) => {
    const [user] = context.sentData
    const userData = await bot.database.getUser(BigInt(user));

    context.sendDefer(userData.riotAccount.isPrivate);
    const matchInfo = await bot.rest.foxy.getValMatchHistoryByUUID(userData.riotAccount.puuid);
    const valUserInfo = await bot.rest.foxy.getValPlayerByUUID(userData.riotAccount.puuid);
    if (!matchInfo) {
        return context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale('commands:valorant.match.notFound'))
        });
    }
    try {
        const embed = createEmbed({
            color: bot.colors.VALORANT,
            thumbnail: {
                url: valUserInfo.data.card.small
            },
            title: context.getEmojiById(bot.emotes.VALORANT_LOGO) + " " + bot.locale('commands:valorant.match.title', { username: valUserInfo.data.name, tag: valUserInfo.data.tag }),
            fields: matchInfo.data.map(match => {
                const currentPlayer = match.stats;

                let teamHasWon;
                let result = context.getEmojiById(bot.emotes.FOXY_RAGE) + " " + bot.locale('commands:valorant.match.draw');

                if (match.teams.red > match.teams.blue) {
                    teamHasWon = "Red";
                     
                } else if (match.teams.red < match.teams.blue) {
                    teamHasWon = "Blue";
                } else {
                    teamHasWon = "Draw";
                }
                
                if (teamHasWon === currentPlayer.team) {
                    result = context.getEmojiById(bot.emotes.FOXY_YAY) + " " + bot.locale('commands:valorant.match.win');
                } else {
                    result = context.getEmojiById(bot.emotes.FOXY_CRY) + " " + bot.locale('commands:valorant.match.loss');
                }

                if (match.meta.mode.toLowerCase() === "deathmatch") {
                    return {
                        name: `${match.meta.map.name} | ${bot.locale(`commands:valorant.match.modes.${match.meta.mode.toLowerCase()}`)}`,
                        value: `${bot.locale('commands:valorant.match.character')}: ${context.getEmojiById(bot.emotes[currentPlayer.character.name.toUpperCase() ?? bot.emotes.FOXY_SHRUG])} \n` +
                            `K/D/A: ${currentPlayer.kills}/${currentPlayer.deaths}/${currentPlayer.assists} \n` +
                            `Score: ${currentPlayer.score} \n`,
                        inline: true
                    }
                } else {
                    return {
                        name: `${match.meta.map.name} | ${bot.locale(`commands:valorant.match.modes.${match.meta.mode.toLowerCase()}`)} | ${match.teams.red ?? 0} - ${match.teams.blue ?? 0} | ${result}`,
                        value: `${bot.locale('commands:valorant.match.character')}: ${context.getEmojiById(bot.emotes[currentPlayer.character.name.toUpperCase() ?? bot.emotes.FOXY_SHRUG])} \n` +
                            `K/D/A: ${currentPlayer.kills}/${currentPlayer.deaths}/${currentPlayer.assists} \n` +
                            `Score: ${currentPlayer.score} \n`,
                        inline: true
                    }
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
        logger.error(err);
        return context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale('commands:valorant.match.notFound'))
        });
    }
}
export default ViewMatchHistory;