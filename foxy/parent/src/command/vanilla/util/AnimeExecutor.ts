import { createEmbed } from "../../../utils/discord/Embed";
import { bot } from '../../../FoxyLauncher';
import scraper from 'mal-scraper';
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function AnimeExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const anime = context.getOption<string>('anime', "full-string");
    await context.sendDefer();

    try {
        const data = await scraper.getInfoFromName(anime);

        if (!data) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:anime.notFound'))
            });
            return endCommand();
        }

        const embed = createEmbed({
            title: data.title,
            url: data.url,
            thumbnail: { url: data.picture },
            description: data.synopsis,
            fields: [
                { name: t("commands:anime.info.status"), value: data.status?.toString() || t("commands:anime.nothing"), inline: true },
                { name: t("commands:anime.info.episodes"), value: data.episodes?.toString() || t("commands:anime.nothing"), inline: true },
                { name: t("commands:anime.info.score"), value: data.score?.toString() || t("commands:anime.nothing"), inline: true },
                { name: t("commands:anime.info.type"), value: data.type?.toString() || t("commands:anime.nothing"), inline: true },
                { name: t("commands:anime.info.aired"), value: data.aired?.toString() || t("commands:anime.nothing"), inline: true },
                { name: t("commands:anime.info.premiered"), value: data.premiered?.toString() || t("commands:anime.nothing"), inline: true },
                { name: t("commands:anime.info.studios"), value: data.studios?.toString() || t("commands:anime.nothing"), inline: true },
                { name: t("commands:anime.info.genres"), value: data.genres?.join(", ")?.toString() || t("commands:anime.nothing"), inline: true },
                { name: t("commands:anime.info.duration"), value: data.duration?.toString() || t("commands:anime.nothing"), inline: true },
                { name: t("commands:anime.info.rating"), value: data.rating?.toString() || t("commands:anime.nothing"), inline: true },
                { name: t("commands:anime.info.broadcast"), value: data.broadcast?.toString() || t("commands:anime.nothing"), inline: true },
                { name: "Trailer", value: data.trailer ? `[Trailer](${data.trailer})` : t("commands:anime.nothing"), inline: true },
            ]
        });

        context.sendReply({ embeds: [embed] });
    } catch (error) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:anime.error'))
        });
    }

    endCommand();
}