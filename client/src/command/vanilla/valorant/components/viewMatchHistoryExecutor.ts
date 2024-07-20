import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { bot } from "../../../../FoxyLauncher";
import { createEmbed } from "../../../../utils/discord/Embed";
import { logger } from "../../../../utils/logger";
import { MatchHistory } from "../../../../structures/types/valorant/MatchHistory";

const ViewMatchHistory = async (context: ComponentInteractionContext) => {
    const [user] = context.sentData
    const userData = await bot.database.getUser(BigInt(user));

    context.sendDefer(userData.riotAccount.isPrivate);
    const matchInfo: MatchHistory = await bot.rest.foxy.getValMatchHistoryByUUID(userData.riotAccount.puuid);
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
                const currentPlayer = match.players.find(player => player.puuid === userData.riotAccount.puuid);

                let teamHasWon = match.teams[0].won ? "Red" : "Blue" || "Draw";
                let result = context.getEmojiById(bot.emotes.FOXY_RAGE) + " " + bot.locale('commands:valorant.match.draw');

                if (teamHasWon !== "Draw") {
                    if (currentPlayer.team_id === teamHasWon) {
                        result = context.getEmojiById(bot.emotes.FOXY_YAY) + " " + bot.locale('commands:valorant.match.win');
                    } else {
                        result = context.getEmojiById(bot.emotes.FOXY_CRY) + " " + bot.locale('commands:valorant.match.loss');
                    }
                }

                return {
                    name: `${match.metadata.map.name} | ${bot.locale(`commands:valorant.match.modes.${match.metadata.queue.name.toLowerCase()}`)} | ${match.teams[0].rounds.won ?? 0} - ${match.teams[1].rounds.won ?? 0} | ${result}`,
                    value: `${bot.locale('commands:valorant.match.character')}: ${context.getEmojiById(bot.emotes[currentPlayer.agent.name.toUpperCase() ?? bot.emotes.FOXY_SHRUG])} \n` +
                        `K/D/A: ${currentPlayer.stats.kills}/${currentPlayer.stats.deaths}/${currentPlayer.stats.assists} \n` +
                        `Score: ${currentPlayer.stats.score} \n` +
                        `${bot.locale('commands:valorant.match.damageMade')}: ${currentPlayer.stats.damage.dealt} \n` +
                        `${bot.locale('commands:valorant.match.damageReceived')}: ${currentPlayer.stats.damage.received} \n`,
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
        logger.error(err);
        return context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale('commands:valorant.match.notFound'))
        });
    }
}
export default ViewMatchHistory;