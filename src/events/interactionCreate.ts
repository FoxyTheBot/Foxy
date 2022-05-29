import i18next from 'i18next';
import { MessageEmbed } from "discord.js";

export default class InteractionCreate {
    private client: any

    constructor(client) {
        this.client = client;
    }

    async run(interaction): Promise<any> {
        const user = await this.client.database.getUserLocale(interaction.user.id);
        let locale = global.t = i18next.getFixedT(user.locale || 'pt-BR');

        if (!interaction.isCommand()) return;
        const command = this.client.commands.get(interaction.commandName);

        if (command.config.dev && !interaction.user.id.includes(this.client.config.ownerId)) {
            return interaction.reply({ content: locale('permissions:ONLY_DEVS'), ephemeral: true });
        }

        function FoxyHandler() {
            new Promise(async (res, rej) => {
                try {
                    command.execute(interaction, locale)
                } catch (e) {
                    console.error(e);
                    const errorEmbed = new MessageEmbed()
                        .setColor("RED")
                        .setTitle("Erro ao executar comando!")
                        .setDescription(`\ \ \`\`\`js\n${e}\n\`\`\``)
                    interaction.reply({ embeds: [errorEmbed], ephemeral: true })
                }
            })
        }

        try {
            const document = await this.client.database.getUser(interaction.user.id);

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