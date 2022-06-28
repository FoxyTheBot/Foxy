import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
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
            const embed = new MessageEmbed()
                .setTitle(data.title)
                .setURL(data.url)
                .setThumbnail(data.picture)
                .setDescription(data?.synopsis)
                .addField(t("commands:anime.info.status"), data.status || t("commands:anime.nothing"), true)
                .addField(t("commands:anime.info.score"), data.score || t("commands:anime.nothing"), true)
                .addField(t("commands:anime.info.episodes"), data.episodes || t("commands:anime.nothing"), true)
                .addField(t("commands:anime.info.type"), data.type || t("commands:anime.nothing"), true)
                .addField(t("commands:anime.info.aired"), data.aired || t("commands:anime.nothing"), true)
                .addField('Trailer', `[${t('anime.click')}](${data.trailer})` || t("commands:anime.nothing"), true)
                .addField(t("commands:anime.info.genres"), data.genres.join(", ") || t("commands:anime.nothing"), true)
                .addField(t("commands:anime.info.source"), data.source || t("commands:anime.nothing"), true)
                .addField(t("commands:anime.info.studios"), data.studios.join(", ") || t("commands:anime.nothing"), true)
                .addField(t("commands:anime.info.duration"), data.duration || t("commands:anime.nothing"), true)
                .addField(t("commands:anime.info.rating"), data.rating || t("commands:anime.nothing"), true)
                .addField(t("commands:anime.info.scoreStats"), data.scoreStats || t("commands:anime.nothing"), true)
                .addField(t("commands:anime.info.popularity"), data.popularity || t("commands:anime.nothing"), true)
                .addField(t("commands:anime.info.premiered"), data.premiered || t("commands:anime.nothing"), true)
                .addField(t("commands:anime.info.broadcast"), data.broadcast || t("commands:anime.nothing"), true)

            interaction.reply({ embeds: [embed] });
        }).catch((err) => {
            interaction.reply(t("commands:anime.notFound"));
        });

    }
}