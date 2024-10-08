import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton } from "../../../utils/discord/Component";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { FoxyClient } from "../../../structures/types/FoxyClient";

export default async function ValorantLinkExecutor(bot: FoxyClient, context: UnleashedCommandExecutor, endCommand, t) {
    context.sendReply({
        embeds: [{
            color: bot.colors.VALORANT,
            title: context.makeReply(bot.emotes.VALORANT_LOGO, t('commands:valorant.linkAccountTitle')),
            description: t('commands:valorant.linkAccountDescription'),
            footer: {
                text: t('commands:valorant.linkAccountFooter')
            }
        }],
        components: [createActionRow([createButton({
            label: t('commands:valorant.linkAccountButton'),
            style: ButtonStyles.Link,
            url: `https://auth.riotgames.com/authorize?client_id=b54a5c51-dd72-400a-8a80-5ad42798cd27&method=riot_identity&platform=web&redirect_uri=https://cakey.foxybot.win/rso/auth/callback&response_type=code&scope=openid%20offline_access`,
            emoji: {
                id: BigInt(bot.emotes.VALORANT_LOGO)
            }
        })])]
    });
    return endCommand();
}