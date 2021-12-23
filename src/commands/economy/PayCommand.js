const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = class PayCommand extends Command {
    constructor(client) {
        super(client, {
            name: "pay",
            description: "Paga alguém.",
            category: "economy",
            data: new SlashCommandBuilder()
                .setName("pay")
                .setDescription("[💵 Economy] Envie FoxCoins para alguém")
                .addNumberOption(option => option.setName("amount").setRequired(true).setDescription("Quantia a pagar."))
                .addUserOption(option => option.setName("user").setRequired(true).setDescription("Usuário a ser pago."))
        });
    }

    async execute(interaction) {
        const amount = interaction.options.getNumber("amount");
        const user = interaction.options.getUser("user");
        const userData = await this.client.database.getUser(interaction.user.id);
        const mentionData = await this.client.database.getUser(user.id);
        const foxCoins = amount;
        const value = Math.round(foxCoins);

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle("SUCCESS")
                    .setLabel("Pagar")
                    .setCustomId("pay")
            )
        if (user === interaction.user) {
            interaction.channel.send("Você não pode pagar você mesmo!");
            return;
        }

        await interaction.reply({ content: `💸 **|** Você deseja mesmo transferir ${amount} FoxCoins para ${user.username}? \nA Equipe da Foxy **Não se responsabiliza** pelas FoxCoins perdidas, então certifique-se de estar transferindo para uma pessoa de confiança! \nÉ proibido o comércio de conteúdo NSFW(+18) em troca de FoxCoins!`, components: [row] });

        const filter = i => i.customId === "pay" && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector(filter, { time: 15000, max: 1 });

        collector.on("collect", async i => {
            interaction.followUp(`Você transferiu ${foxCoins} FoxCoins para ${user.username}`);
            mentionData.balance += value;
            userData.balance -= value;
            userData.save();
            mentionData.save();
            i.deferUpdate();
        })
    }
}