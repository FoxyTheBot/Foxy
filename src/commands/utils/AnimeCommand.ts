import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";
import malScraper from "mal-scraper";

export default class AnimeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "anime",
            description: "See information about an anime",
            category: "utils",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("anime")
                .setDescription("[Utils] See information about an anime")
                .addStringOption(option => option.setName("anime").setRequired(true).setDescription("The name of the anime"))
        });
    }

    async execute(interaction, t): Promise<void> {
        const search = await interaction.options.getString("anime");

        malScraper.getInfoFromName(search).then(async (data) => {
            if (!data) return interaction.reply(t("commands:anime.notFound"));
            const embed = new EmbedBuilder()
                .setTitle(data.title)
                .setURL(data.url)
                .setThumbnail(data.picture)
                .setDescription(data?.synopsis)
                .addFields([
                    { name: t("commands:anime.info.status"), value: data.status || t("commands:anime.nothing"), inline: true },
                    { name: t("commands:anime.info.score"), value: data.score || t("commands:anime.nothing"), inline: true },
                    { name: t("commands:anime.info.episodes"), value: data.episodes || t("commands:anime.nothing"), inline: true },
                    { name: t("commands:anime.info.type"), value: data.type || t("commands:anime.nothing"), inline: true },
                    { name: t("commands:anime.info.aired"), value: data.aired || t("commands:anime.nothing"), inline: true },
                    { name: 'Trailer', value: `[${t('anime.click')}](${data.trailer})` || t("commands:anime.nothing"), inline: true },
                    { name: t("commands:anime.info.genres"), value: data.genres.join(", ") || t("commands:anime.nothing"), inline: true },
                    { name: t("commands:anime.info.source"), value: data.source || t("commands:anime.nothing"), inline: true },
                    { name: t("commands:anime.info.studios"), value: data.studios.join(", ") || t("commands:anime.nothing"), inline: true },
                    { name: t("commands:anime.info.duration"), value: data.duration || t("commands:anime.nothing"), inline: true },
                    { name: t("commands:anime.info.rating"), value: data.rating || t("commands:anime.nothing"), inline: true },
                    { name: t("commands:anime.info.scoreStats"), value: data.scoreStats || t("commands:anime.nothing"), inline: true },
                    { name: t("commands:anime.info.popularity"), value: data.popularity || t("commands:anime.nothing"), inline: true },
                    { name: t("commands:anime.info.premiered"), value: data.premiered || t("commands:anime.nothing"), inline: true },
                    { name: t("commands:anime.info.broadcast"), value: data.broadcast || t("commands:anime.nothing"), inline: true }
                ])

            interaction.reply({ embeds: [embed] });
        }).catch((err) => {
            interaction.reply(t("commands:anime.notFound"));
        });

    }
}