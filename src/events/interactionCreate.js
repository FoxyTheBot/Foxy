const { MessageEmbed } = require("discord.js");

module.exports = class InteractionCreate {
    constructor(client) {
        this.client = client;
    }

    async run(interaction) {
        if (!interaction.isCommand()) return;
        const command = this.client.commands.get(interaction.commandName);

        function FoxyHandler() {
            new Promise(async (res, rej) => {
                try {
                    await command.execute(interaction)
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
                    .setTitle('Você foi banido(a) :DiscordBan:')
                    .setColor("RED")
                    .setDescription('Você foi banido(a) de usar a Foxy em qualquer servidor no Discord! \n Caso seu ban foi injusto (o que eu acho muito difícil) você pode solicitar seu unban no meu [servidor de suporte](https://gg/kFZzmpD) \n **Leia os termos em** [Termos de uso](https://foxywebsite.ml/tos.html)')
                    .addFields(
                        { name: "Motivo do Ban:", value: document.banReason, inline: true }
                    )
                return interaction.reply({ embeds: [bannedEmbed] });
            }

            FoxyHandler();
        } catch (err) {
            console.error(err);
            errorEmbed.setDescription(`\`\`\`js\n${err}\n\`\`\``)
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
}