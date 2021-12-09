const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = class DivorceCommand extends Command {
    constructor(client) {
        super(client, {
            name: "divorce",
            description: "Divorciar-se",
            category: "social",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("divorce")
                .setDescription("Divorciar-se")
        })
    }

    async execute(interaction) {
        const userData = await this.client.database.getUser(interaction.user.id);
        const marriedId = await userData.marriedWith;
        if (!marriedId) return interaction.reply("Você não está casado!");

        const marriedData = await this.client.database.getUser(marriedId);
        if (!marriedData) return interaction.reply(`O usuário não está no banco de dados!`);

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("yes")
                    .setLabel("💔 Sim")
                    .setStyle("DANGER"),
            )

        interaction.reply({ content: "Você tem certeza que deseja divorciar-se?", components: [row] });

        const filter = i => i.customId === 'yes' && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000, max: 1 });

        collector.on("collect", async i => {
            userData.marriedWith = null;
            marriedData.marriedWith = null;
            await userData.save();
            await marriedData.save();
            i.deferUpdate();
            return interaction.followUp("Você se divorciou com sucesso!");
        });
    }
}