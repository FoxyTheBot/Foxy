const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = class CancelCommand extends Command {
    constructor(client) {
        super(client, {
            name: "cancel",
            category: "entertainment",
            data: new SlashCommandBuilder()
                .setName("cancel")
                .setDescription("[✨ Entertainment] Cancele alguém")
                .addUserOption(option => option.setName("user").setDescription("Mencione alguém").setRequired(true))
                .addStringOption(option => option.setName("text").setDescription("Texto do cancelamento").setRequired(true))
        });
    }

    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const string = interaction.options.getString("text");

        await interaction.reply(`${interaction.user} cancelou ${user} por ${string}`);
    }
}