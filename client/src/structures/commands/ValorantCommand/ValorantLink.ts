import { ButtonStyles } from "discordeno/types";
import ChatInputInteractionContext from "../ChatInputInteractionContext";
import { createActionRow, createButton } from "../../../utils/discord/Component";

export default async function executeValorantLinkCommand(bot, context: ChatInputInteractionContext, endCommand, t) {
    context.sendReply({
        embeds: [{
            color: 0xff4454,
            title: context.makeReply(bot.emotes.VALORANT_LOGO, t('commands:valorant.linkAccountTitle')),
            description: t('commands:valorant.linkAccountDescription')
        }],
        components: [createActionRow([createButton({
            label: t('commands:valorant.linkAccountButton'),
            style: ButtonStyles.Link,
            url: `https://auth.riotgames.com/login#client_id=b54a5c51-dd72-400a-8a80-5ad42798cd27&redirect_uri=https://cakey.foxybot.win/rso/auth/callback&response_type=code&scope=openid&state=${context.author.id}`,
            emoji: {
                id: bot.emotes.VALORANT_LOGO
            }
        })])]
    });
    return endCommand();
}