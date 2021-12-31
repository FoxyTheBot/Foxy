const { MessageEmbed } = require("discord.js");

module.exports = class InteractionCreate {
    constructor(client) {
        this.client = client;
    }

    async run(interaction) {
        if (!interaction.isCommand()) return;
        await interaction.deferReply();
        const command = this.client.commands.get(interaction.commandName);

        if (command.config.dev && !interaction.user.id.includes(this.client.config.ownerId)) {
            return interaction.editReply({ content: `:x: **|** Este comando é apenas para o meu desenvolvedor, bobinho!`, ephemeral: true });
        }

        function FoxyHandler() {
            new Promise(async (res, rej) => {
                try {
                    command.execute(interaction)
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
                    .addField("Data do banimento", document.banData.toLocaleString())
                    .setFooter("Será que você ainda pode se desculpar?")
                return interaction.editReply({ embeds: [bannedEmbed], ephemeral: true });
            }

            FoxyHandler();
        } catch (err) {
            console.error(err);
            errorEmbed.setDescription(`\`\`\`js\n${err}\n\`\`\``)
            return interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
}