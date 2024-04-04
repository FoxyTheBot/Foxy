import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../index";
import { createEmbed } from "../../../discord/Embed";

const ViewMatchHistory = async (context: ComponentInteractionContext) => {
    const [user] = context.sentData
    const userData = await bot.database.getUser(BigInt(user));

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
                let teamHasWon;
                let result;

                if (match.teams.red > match.teams.blue) {
                    teamHasWon = "Red";
                } else if (match.teams.red < match.teams.blue) {
                    teamHasWon = "Blue";
                } else {
                    teamHasWon = "Draw";
                    result = context.getEmojiById(bot.emotes.FOXY_RAGE) + " " + bot.locale('commands:valorant.match.draw');
                }

                if (teamHasWon !== "Draw") {
                    if (match.stats.team === teamHasWon) {
                        result = context.getEmojiById(bot.emotes.FOXY_YAY) + " " + bot.locale('commands:valorant.match.win');
                    } else {
                        result = context.getEmojiById(bot.emotes.FOXY_CRY) + " " + bot.locale('commands:valorant.match.loss');
                    }
                }


                return {
                    name: `${match.meta.map.name} | ${bot.locale(`commands:valorant.match.modes.${match.meta.mode.toLowerCase()}`)} | ${match.teams.red ?? 0} - ${match.teams.blue ?? 0} | ${result}`,
                    value: `${bot.locale('commands:valorant.match.character')}: ${context.getEmojiById(bot.emotes[match.stats.character.name.toUpperCase() ?? bot.emotes.FOXY_SHRUG])} \n` +
                        `K/D/A: ${match.stats.kills}/${match.stats.deaths}/${match.stats.assists} \n` +
                        `Score: ${match.stats.score} \n` +
                        `${bot.locale('commands:valorant.match.damageMade')}: ${match.stats.damage.made} \n` +
                        `${bot.locale('commands:valorant.match.damageReceived')}: ${match.stats.damage.received} \n`,
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