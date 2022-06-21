import i18next from 'i18next';
import { MessageEmbed } from "discord.js";

export default class InteractionCreate {
    private client: any

    constructor(client) {
        this.client = client;
    }

    async run(interaction): Promise<any> {
        const user = await this.client.database.getUserByID(interaction.user.id);
        let locale = global.t = i18next.getFixedT(user.language || 'pt-BR');

        const command = this.client.commands.get(interaction.commandName);
        function FoxyHandler() {
            new Promise(async (res, rej) => {
                try {
                    if (interaction.isCommand() || interaction.isAutocomplete()) {
                        command.execute(interaction, locale)
                    }
                } catch (e) {
                    console.error(e);
                    interaction.reply({ content: locale('events:interactionCreate.commandError'), ephemeral: true })
                }
            })
        }

        try {
            const document = await this.client.database.getUserByID(interaction.user.id);

            if (document.isBanned) {
                const bannedEmbed = new MessageEmbed()
                    .setTitle(locale('events:ban.title'))
                    .setColor("RED")
                    .setDescription(locale('events:ban.description'))
                    .addField(locale('events:ban.reason'), document.banReason, true)
                    .addField(locale('events:ban.date'), document.banData.toLocaleString(global.t.lng, { timeZone: "America/Sao_Paulo", hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' }))
                return interaction.reply({ embeds: [bannedEmbed], ephemeral: true });
            }

            FoxyHandler();
        } catch (err) {
            console.error(err);
        }
    }
}