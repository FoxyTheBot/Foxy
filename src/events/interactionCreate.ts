import i18next from 'i18next';
import { MessageEmbed } from "discord.js";

export default class InteractionCreate {
    private client: any

    constructor(client) {
        this.client = client;
    }

    async run(interaction) {
        const user = await this.client.database.getUser(interaction.user.id);
        let locale = global.t = i18next.getFixedT(user.lang || 'pt-BR');

        if (!interaction.isCommand()) return;
        const command = this.client.commands.get(interaction.commandName);

        if (command.config.dev && !interaction.user.id.includes(this.client.config.ownerId)) {
            return interaction.editReply({ content: `:x: **|** Este comando é apenas para o meu desenvolvedor, bobinho!`, ephemeral: true });
        }

        function FoxyHandler() {
            new Promise(async (res, rej) => {
                try {
                    await interaction.deferReply();
                    command.execute(interaction, locale)
                } catch (e) {
                    console.error(e);
                    const errorEmbed = new MessageEmbed()
                        .setColor("RED")
                        .setTitle("Erro ao executar comando!")
                        .setDescription(`\ \ \`\`\`js\n${e}\n\`\`\``)
                    interaction.editReply({ embeds: [errorEmbed], ephemeral: true })
                }
            })
        }

        try {
            const document = await this.client.database.getUser(interaction.user.id);

            if (document.isBanned) {
                const bannedEmbed = new MessageEmbed()
                    .setTitle(`❌ | Você esta **banido(a)**`)
                    .setColor("RED")
                    .setDescription("Se você quiser fazer um apelo de ban você pode preencher este formulário (linkdoform) \n\n Recomendado você ler os [termos de uso](https://foxywebsite.xyz/privacy)")
                    .addField("Motivo do banimento:", document.banReason, true)
                    .addField("Data do banimento", document.banData.toLocaleString('pt-BR', { timeZone: "America/Sao_Paulo", hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' }))
                return interaction.editReply({ embeds: [bannedEmbed], ephemeral: true });
            }

            FoxyHandler();
        } catch (err) {
            console.error(err);
        };
    }
}