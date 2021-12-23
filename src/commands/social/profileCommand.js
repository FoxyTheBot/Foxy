const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment } = require("discord.js");
const GenerateImage = require("../../structures/GenerateImage");

module.exports = class ProfileCommand extends Command {
    constructor(client) {
        super(client, {
            name: "profile",
            description: "Veja seu perfil",
            category: "social",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("profile")
                .setDescription("[👥 Social] Veja seu perfil")
                .addUserOption(option => option.setName("user").setRequired(false).setDescription("Veja perfil de outra pessoa"))
        });
    }

    async execute(interaction) {
        const user = interaction.options.getUser("user") || interaction.user;
        interaction.deferReply();
        const userData = await this.client.database.getUser(user.id);
        const canvasGenerator = new GenerateImage(this.client, user, userData, 1436, 884);
        const profile = new MessageAttachment(await canvasGenerator.renderProfile(), "foxy_profile.png");

        interaction.editReply({ content: "📝 | Perfil", files: [profile.attachment] });
    }
}