const Command = require("../../structures/Command");
const { MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = class MarryCommand extends Command {
    constructor(client) {
        super(client, {
            name: "marry",
            description: "Case com algum usuário",
            category: "social",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("marry")
                .setDescription("Case com algum usuário")
                .addUserOption(option => option.setName("user").setDescription("Mencione um usuário").setRequired(true))
        })
    }

    async execute(interaction) {
        const user = await interaction.options.getUser("user");

        if (user === interaction.user) return interaction.reply(`${this.client.emotes.error} | Você não pode casar com si mesmo!`);
        const authorData = await this.client.database.getUser(interaction.user.id);
        if (authorData.marriedWith) return interaction.reply(`${this.client.emotes.error} | Você já está casado com alguém!`);
        if (user === this.client.user) return interaction.reply(`${this.client.emotes.scared} | Nah! Eu não quero casar com você`);
        if (user.id === authorData.marriedWith) return interaction.reply(`${this.client.emotes.error} | Você já está casado com ${user.username}`);

        const userData = await this.client.database.getUser(user.id);
        if (userData.marriedWith) return interaction.reply(`${this.client.emotes.error} | ${user.username} já está casado com alguém!`);

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('accept')
                    .setLabel(`Aceitar`)
                    .setStyle("SUCCESS"),
            )
        interaction.reply({ content: `${this.client.emotes.heart} | ${user} Você recebeu um pedido de casamento de ${interaction.user}, você tem 1 minuto para aceitar!`, components: [row] });

        const filter = i => i.customId === 'accept' && i.user.id === user.id;
        const collector = interaction.channel.createMessageComponentCollector(filter, { time: 60000, max: 1 });

        collector.on("collect", async i => {
            interaction.followUp(`${this.client.emotes.success} | Vocês estão casados! Felicidades para o casal! ^^`);
            userData.marriedWith = interaction.user.id;
            authorData.marriedWith = user.id;
            await userData.save();
            await authorData.save();
        });
    }
}