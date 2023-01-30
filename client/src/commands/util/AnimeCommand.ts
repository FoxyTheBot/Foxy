import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";
import { ApplicationCommandOptionTypes } from "discordeno/types";
const scraper = require('mal-scraper');

const AnimeCommand = createCommand({
    path: '',
    name: "anime",
    description: "Pesquisa a informação de algum anime",
    descriptionLocalizations: {
        "en-US": "Searches for information about an anime"
    },
    category: "util",
    options: [
        {
            name: 'anime',
            type: ApplicationCommandOptionTypes.String,
            description: 'Nome do anime que você quer pesquisar',
            descriptionLocalizations: { 'en-US': 'Name of the anime you want to search' },
            required: true
        }
    ],
    authorDataFields: [],

    execute: async (ctx, finishCommand, t) => {
        const anime = ctx.getOption<string>('anime', false);
        await ctx.defer();
        scraper.getInfoFromName(anime).then(async (data) => {
            if (!data) return ctx.foxyReply({
                content: ctx.prettyReply("🚫", t('commands:anime.notFound'))
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
            ctx.foxyReply({ embeds: [embed] });
        });
        finishCommand();
    }
});

export default AnimeCommand;