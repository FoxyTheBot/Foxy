const Command = require("../../structures/Command.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = class ServerCommand extends Command {
    constructor(client) {
        super(client, {
            name: "server",
            description: "View information about the server.",
            category: "utils",
            data: new SlashCommandBuilder()
                .setName("server")
                .setDescription("[🛠 Utils] Veja informações sobre o servidor.")
                .addSubcommand(option => option.setName("info").setDescription("Veja informações sobre o servidor.").addStringOption(
                    option => option.setName("id").setDescription("ID do servidor.").setRequired(false)))
                .addSubcommand(option => option.setName("icon").setDescription("Veja o ícone do servidor.").addStringOption(
                    option => option.setName("id").setDescription("ID do servidor.").setRequired(false)))
        })
    }

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        var server = interaction.guild;
        if (interaction.options.getString("id")) {
            server = await this.client.guilds.cache.get(interaction.options.getString("id"));
            if (!server) return interaction.reply(`${this.client.emotes.error} **|** Não conheço nenhum servidor com a ID \`${interaction.options.getString("id")}\``);
        }
        const owner = await this.client.users.fetch(server.ownerId);

        let partner = server.partnered;

        if (partner === false) partner = "Não";
        else partner = "Sim";

        let afk = server.afkChannel;
        if (!afk) afk = "Não";

        switch (subcommand) {
            case "info": {
                const embed = new MessageEmbed()
                    .setTitle(server.name)
                    .setThumbnail(server.iconURL())
                    .addFields(
                        { name: ":crown: Dono", value: `\`${owner.tag}\``, inline: true },
                        { name: ":computer: ID", value: `\`${server.id}\``, inline: true },
                        { name: ":calendar: Criado em", value: `\`${server.createdAt.toLocaleString()}\``, inline: true },
                        { name: ":star: Entrei em", value: `\`${server.joinedAt.toLocaleString()}\`` || "Não estou no servidor :(", inline: true },
                        { name: ":speech_balloon: Canais", value: `\`${server.channels.cache.size}\``, inline: true },
                        { name: '<a:impulso:756507043854024784> Impulsos:', value: server.premiumSubscriptionCount.toString(), inline: true },
                        { name: ":busts_in_silhouette: Membros", value: `\`${server.memberCount}\``, inline: true },
                        { name: "<a:sleeepy:803647820867174421> Partner", value: `\`${partner}\``, inline: true },
                        { name: '<a:sleeepy:803647820867174421> Canal AFK', value: `${afk}`, inline: true },
                        { name: ':computer: Shard ID', value: `${server.shardId + 1}`, inline: true },


                    )
                await interaction.reply({ embeds: [embed] });
                break;
            }
            case "icon": {
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel("Abrir no navegador")
                            .setStyle("LINK")
                            .setURL(server.iconURL({ format: "png", size: 2048 }))
                    )
                const embed = new MessageEmbed()
                    .setTitle(server.name)
                    .setImage(server.iconURL({ dynamic: true, size: 2048 }))

                await interaction.reply({ embeds: [embed], components: [row] });
                break;
            }
        }
    }
}