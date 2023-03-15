import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { bot } from '../../index';
import scraper from 'mal-scraper';

const AnimeCommand = createCommand({
name: "anime",
    description: "[Utils] Searches for information about an anime",
    descriptionLocalizations: {
        "pt-BR": "[Utils] Pesquisa a informação de algum anime"
    },
    category: "util",
    options: [
        {
            name: 'anime',
            type: ApplicationCommandOptionTypes.String,
            description: 'Name of the anime you want to search',
            descriptionLocalizations: { 'pt-BR': 'Nome do anime que você quer pesquisar' },
            required: true
        }
    ],

    execute: async (context, endCommand, t) => {
        const anime = context.getOption<string>('anime', false);
        await context.sendDefer();
        scraper.getInfoFromName(anime).then(async (data) => {
            if (!data) return context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:anime.notFound'))
            })

            const embed = createEmbed({
                title: data.title,
                url: data.url,
                thumbnail: { url: data.picture },
                description: data.synopsis,
                fields: [
                    { name: t("commands:anime.info.status"), value: data.status.toString() || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.episodes"), value: data.episodes.toString() || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.score"), value: data.score.toString() || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.type"), value: data.type.toString() || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.aired"), value: data.aired.toString() || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.premiered"), value: data.premiered.toString() || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.studios"), value: data.studios.toString() || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.genres"), value: data.genres.join(", ").toString() || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.duration"), value: data.duration.toString() || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.rating"), value: data.rating.toString() || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.broadcast"), value: data.broadcast.toString() || t("commands:anime.nothing"), inline: true},
                    { name: "Trailer", value: `[${t('anime.click')}](${data.trailer})` || t("commands:anime.nothing"), inline: true},
                ]
            });
            context.sendReply({ embeds: [embed] });
        });
        endCommand();
    }
});

export default AnimeCommand;