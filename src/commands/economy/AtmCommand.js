const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = class AtmCommand extends Command {
    constructor(client) {
        super(client, {
            name: "atm",
            description: "Mostra o seu saldo",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("atm")
                .setDescription("Mostra as suas FoxCoins ou de alguém")
                .addUserOption(option => option.setName("user").setDescription("Mencione um usuário").setRequired(false))
        })
    }

    async execute(interaction) {
        const user = await interaction.options.getUser("user") || interaction.user;
        const userData = await this.client.database.getDocument(user.id);
        const money = await userData.balance;

        interaction.reply(`💵 **|** Você possui ${money} FoxCoins`);
    }
}