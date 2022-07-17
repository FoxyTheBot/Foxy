import i18next from 'i18next';
import { EmbedBuilder, InteractionType } from "discord.js";

export default class InteractionCreate {
    private client: any

    constructor(client) {
        this.client = client;
    }

    async run(interaction): Promise<any> {
        const user = await this.client.database.getUser(interaction.user.id);
        let locale = global.t = i18next.getFixedT(user.language || 'pt-BR');

        const command = this.client.commands.get(interaction.commandName);
        function FoxyHandler() {
            new Promise(async (res, rej) => {
                try {
                    if (interaction.type === InteractionType.ApplicationCommand || interaction.type === InteractionType.ApplicationCommandAutocomplete) {
                        command.execute(interaction, locale)
                    }
                } catch (e) {
                    console.error(e);
                    interaction.reply({ content: locale('events:interactionCreate.commandError'), ephemeral: true })
                }
            })
        }

        try {
            const document = await this.client.database.getUser(interaction.user.id);

            if (document.isBanned) {
                const bannedEmbed = new EmbedBuilder()
                    .setTitle(locale('events:ban.title'))
                    .setColor("#ED4245")
                    .setDescription(locale('events:ban.description'))
                    .addFields([
                        { name: locale('events:ban.reason'), value: document.banReason, inline: true },
                        { name: locale('events:ban.date'), value: document.banData.toLocaleString(global.t.lng, { timeZone: "America/Sao_Paulo", hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' }) }
                    ])
                return interaction.reply({ embeds: [bannedEmbed], ephemeral: true });
            }

            FoxyHandler();
        } catch (err) {
            console.error(err);
        }
    }
}