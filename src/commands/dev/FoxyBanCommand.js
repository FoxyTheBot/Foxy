const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = class TestCommand extends Command {
    constructor(client) {
        super(client, {
            name: "foxyban",
            category: "dev",
            dev: true,
            data: new SlashCommandBuilder()
                .setName("foxyban")
                .setDescription("[🔑 Dev] Bane um usuário de usar a Foxy")
                .addUserOption(option => option.setName("user").setDescription("Usuário que será banido").setRequired(true))
                .addBooleanOption(option => option.setName("banned").setDescription("Definir o status como banido ou não").setRequired(true))
                .addStringOption(option => option.setName("reason").setDescription("Motivo do banimento").setRequired(true))
        });
    }

    async execute(interaction) {
        const bool = interaction.options.getBoolean("banned");
        const userBanned = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        const userData = await this.client.database.getUser(userBanned.id);
        switch (bool) {
            case true: {
                userData.isBanned = true;
                userData.banReason = reason;
                userData.banData = new Date();
                userData.save();
                await interaction.editReply(`${this.client.emotes.success} **|** **${userBanned.tag}** foi banido!`);
                break;
            }

            case false: {
                userData.isBanned = false;
                userData.banReason = null;
                userData.banData = null;
                userData.save();
                await interaction.editReply(`${this.client.emotes.success} **|** **${user.tag}** foi desbanido`);
            }
        }
    }
}