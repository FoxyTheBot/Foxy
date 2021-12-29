const Command = require("../../structures/Command");
const { MessageEmbed, InteractionWebhook } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const malScraper = require("mal-scraper");

module.exports = class AnimeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "anime",
            description: "Pesquise por um anime",
            category: "utils",
            dev: false,
            data: new SlashCommandBuilder()
            .setName("anime")
            .setDescription("[🛠 Utils] Pesquise por um anime")
            .addStringOption(option => option.setName("anime").setDescription("Nome do anime").setRequired(true))
        });
    }

    async execute(interaction) {
        const search = await interaction.options.getString("anime");

        malScraper.getInfoFromName(search).then(async data => {
            const animeEmbed = new MessageEmbed()
                .setTitle(data.title)
                .setURL(data.url)
                .setDescription(data.synopsis)
                .addFields(
                    { name: "Episódios", value: data.episodes },
                    { name: "Tipo", value: data.type },
                    { name: "Avaliação", value: data.score },
                    { name: "Status", value: data.status },
                    { name: "Popularidade", value: data.popularity },
                    { name: "Duração", value: data.duration },
                    { name: "Gêneros", value: data.genres.join(", ") },
                )

                await interaction.editReply({ embeds: [animeEmbed] });
        }).catch(err => {
            interaction.editReply("Eu não consegui encontrar esse anime :/");
        })
    }
}